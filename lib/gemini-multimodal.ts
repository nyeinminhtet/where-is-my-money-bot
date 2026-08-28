import {
  GoogleGenerativeAI,
  SchemaType,
  ResponseSchema,
} from "@google/generative-ai";
import { env } from "./env";
import { waitForRateLimit } from "./rate-limiter";

const genAI = new GoogleGenerativeAI(env.gemini.apiKey);
const modelName = env.gemini.model;

// ── GeminiParsedData Interface (per spec) ──
export interface GeminiParsedData {
  amount: number;
  type: "EXPENSE" | "INCOME";
  category: string;
  title: string;
  note?: string;
}

// ── Shared Transaction Schema for all modalities ──
const transactionSchema: ResponseSchema = {
  type: SchemaType.ARRAY,
  description: "List of financial transactions extracted from input.",
  items: {
    type: SchemaType.OBJECT,
    properties: {
      isTransaction: {
        type: SchemaType.BOOLEAN,
        description: "True if valid transaction, false otherwise.",
      },
      amount: {
        type: SchemaType.NUMBER,
        description: "Transaction amount in MMK. Default 0 if not found.",
      },
      type: {
        type: SchemaType.STRING,
        format: "enum",
        enum: ["INCOME", "EXPENSE"],
        description: "Transaction type. Default EXPENSE.",
      },
      category: {
        type: SchemaType.STRING,
        format: "enum",
        enum: [
          "အစားအသောက်",
          "သွားလာရေး",
          "အိမ်စရိတ်",
          "မီး/ရေ/အင်တာနက်",
          "ကျန်းမာရေး",
          "ဈေးဝယ်ခြင်း",
          "ဖျော်ဖြေရေး",
          "အခြား",
        ],
        description: "Category matching merchant type.",
      },
      description: {
        type: SchemaType.STRING,
        description: "Short item description in Burmese or English.",
      },
    },
    required: ["isTransaction", "amount", "type", "category"],
  },
};

// ── Single model instance for all modalities ──
const model = genAI.getGenerativeModel(
  {
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: transactionSchema,
    },
  },
  { baseUrl: env.gemini.proxyUrl },
);

// ── Input Types ──
export type GeminiInput =
  | { mode: "text"; text: string }
  | { mode: "voice"; buffer: ArrayBuffer; mimeType: string }
  | { mode: "photo"; buffer: ArrayBuffer; mimeType: string };

// ── Prompt Templates ──
const TEXT_PROMPT = (text: string) =>
  `Extract all financial transactions from: "${text}". ` +
  `Convert Myanmar digits (၁၂၃) to English. ` +
  `If multiple, extract each separately. ` +
  `No item name = not a valid transaction.`;

const VOICE_PROMPT =
  `You are a Myanmar personal finance assistant. The user sent a voice message.\n` +
  `Transcribe and extract ALL financial transactions from this audio.\n` +
  `Convert Myanmar digits (၁၂၃၄၅) to English numbers.\n` +
  `Spending → EXPENSE. Earning/receiving → INCOME.\n` +
  `Multiple transactions → extract each separately.\n` +
  `No valid transaction → return empty array.`;

const PHOTO_PROMPT =
  `You are a Myanmar personal finance receipt scanner. Analyze this receipt/slip.\n` +
  `Extract:\n` +
  `- Total amount (look for Total, စုစုပေါင်း, or final amount)\n` +
  `- Merchant/store name as description\n` +
  `- Category from merchant type:\n` +
  `  Food/drink → အစားအသောက်\n` +
  `  Transport/gas → သွားလာရေး\n` +
  `  Utilities/bills → မီး/ရေ/အင်တာနက်\n` +
  `  Medical/pharmacy → ကျန်းမာရေး\n` +
  `  Shopping/grocery → ဈေးဝယ်ခြင်း\n` +
  `  Entertainment → ဖျော်ဖြေရေး\n` +
  `  Other/unknown → အခြား\n` +
  `Multiple items → extract each separately.\n` +
  `No valid transaction → return empty array.`;

// ── Unified Parser Function ──
export const parseInputWithGemini = async (
  input: GeminiInput,
): Promise<GeminiParsedData[] | null> => {
  try {
    await waitForRateLimit();

    let result;

    if (input.mode === "text") {
      if (!input.text || input.text.trim().length < 2) return null;
      result = await model.generateContent(TEXT_PROMPT(input.text));
    } else if (input.mode === "voice") {
      const base64 = Buffer.from(new Uint8Array(input.buffer)).toString("base64");
      result = await model.generateContent([
        { inlineData: { mimeType: input.mimeType, data: base64 } },
        VOICE_PROMPT,
      ]);
    } else {
      // photo
      const base64 = Buffer.from(new Uint8Array(input.buffer)).toString("base64");
      result = await model.generateContent([
        { inlineData: { mimeType: input.mimeType, data: base64 } },
        PHOTO_PROMPT,
      ]);
    }

    const responseText = result.response.text();
    if (!responseText) return null;

    const parsed = JSON.parse(responseText);
    const items = Array.isArray(parsed) ? parsed : [parsed];

    // Map to GeminiParsedData (add title from description, keep note)
    return items.map((item: any) => ({
      amount: item.amount || 0,
      type: item.type || "EXPENSE",
      category: item.category || "အခြား",
      title: item.description || item.title || "",
      note: item.note || undefined,
    }));
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return null;
  }
};
