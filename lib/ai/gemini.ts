import {
  GoogleGenerativeAI,
  SchemaType,
  ResponseSchema,
} from "@google/generative-ai";
import { env } from "@/lib/env";
import { waitForRateLimit } from "@/lib/rate-limiter";
import { GEMINI_EXPENSE_CATEGORIES } from "@/constants/categories";
import { MYANMAR_OFFSET_MS } from "@/utils/date";

const apiKey = env.gemini.apiKey;
const modelName = env.gemini.model;
if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

const genAI = new GoogleGenerativeAI(apiKey);

// ── Transaction Logging Schema ──
const transactionSchema: ResponseSchema = {
  type: SchemaType.ARRAY,
  description: "Financial transactions extracted from user input.",
  items: {
    type: SchemaType.OBJECT,
    properties: {
      isTransaction: {
        type: SchemaType.BOOLEAN,
        description: "True if valid transaction, false otherwise.",
      },
      amount: {
        type: SchemaType.NUMBER,
        description: "Amount in MMK (convert Myanmar digits). Default 0.",
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
        enum: GEMINI_EXPENSE_CATEGORIES,
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

// ── Query Intent Schema ──
const queryIntentSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  description: "Extracted intent for transaction search query.",
  properties: {
    isFinanceRelated: { type: SchemaType.BOOLEAN, description: "True if finance question." },
    startDate: { type: SchemaType.STRING, description: "YYYY-MM-DD or null." },
    endDate: { type: SchemaType.STRING, description: "YYYY-MM-DD or null." },
    category: { type: SchemaType.STRING, description: "Match predefined category or null." },
    searchKeyword: { type: SchemaType.STRING, description: "Specific item keyword or null." },
    type: { type: SchemaType.STRING, format: "enum", enum: ["INCOME", "EXPENSE"] },
  },
  required: ["isFinanceRelated"],
};

// ── Models ──
const getModel = (
  schema: ResponseSchema,
) =>
  genAI.getGenerativeModel(
    {
      model: modelName,
      generationConfig: { responseMimeType: "application/json", responseSchema: schema },
    },
    { baseUrl: env.gemini.proxyUrl },
  );

const txModel = getModel(transactionSchema);
const intentModel = getModel(queryIntentSchema);

export const getAnswerModel = () =>
  genAI.getGenerativeModel(
    { model: modelName },
    { baseUrl: env.gemini.proxyUrl },
  );

// ── Types ──
export interface AIParsedTransaction {
  isTransaction: boolean;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string;
}

export interface GeminiParsedData {
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  title: string;
  note?: string;
}

export interface QueryIntent {
  isFinanceRelated: boolean;
  startDate?: string;
  endDate?: string;
  category?: string;
  searchKeyword?: string;
  type?: "INCOME" | "EXPENSE";
}

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

// ── Text Transaction Parser ──
export const parseTextWithAI = async (
  userText: string,
): Promise<AIParsedTransaction[] | null> => {
  if (!userText || userText.trim().length < 2) return null;
  try {
    await waitForRateLimit();
    const result = await txModel.generateContent(TEXT_PROMPT(userText));
    const text = result.response.text();
    if (!text) return null;
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error("Gemini AI Parsing Error:", error);
    return null;
  }
};

// ── Query Intent Parser ──
export const parseUserQueryIntent = async (userText: string): Promise<QueryIntent | null> => {
  if (!userText || userText.trim().length < 2) return null;
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const mm = new Date(new Date().getTime() + MYANMAR_OFFSET_MS);
  const today = fmt(mm);
  const yesterday = fmt(new Date(mm.getFullYear(), mm.getMonth(), mm.getDate() - 1));
  const startOfMonth = fmt(new Date(mm.getFullYear(), mm.getMonth(), 1));
  const prevStart = fmt(new Date(mm.getFullYear(), mm.getMonth() - 1, 1));
  const prevEnd = fmt(new Date(mm.getFullYear(), mm.getMonth(), 0));

  try {
    await waitForRateLimit();
    const prompt = `You are a query intent parser for a Myanmar personal finance bot.
[Dynamic Date Context (Myanmar UTC+6:30)] Today: ${today}, Yesterday: ${yesterday}, StartOfMonth: ${startOfMonth}, PrevMonth: ${prevStart} to ${prevEnd}
[Categories] EXPENSE: ["အစားအသောက်","သွားလာရေး","အိမ်ငှားခ","မီး/ရေ/အင်တာနက်","ကျန်းမာရေး","ဈေးဝယ်ခြင်း","ပညာရေး","ဖျော်ဖြေရေး","မိသားစု","အခြား"] INCOME: ["လစာ","စီးပွားရေး","Freelance","လက်ဆောင်","ရင်းနှီးမြှုပ်နှံမှု","အခြား"]
[Rules] 1. General spending/income questions: category=null, searchKeyword=null. 2. NEVER use generic terms ("ပိုက်ဆံ","ငွေ","money") as keyword/category. 3. Only set category/keyword for specific items. 4. isFinanceRelated=true for money questions.
User text: "${userText}"`;
    const result = await intentModel.generateContent(prompt);
    const text = result.response.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Query Intent Error:", error);
    return null;
  }
};

// ── Multimodal Input Types ──
export type GeminiInput =
  | { mode: "text"; text: string }
  | { mode: "voice"; buffer: ArrayBuffer; mimeType: string }
  | { mode: "photo"; buffer: ArrayBuffer; mimeType: string };

// ── Unified Multimodal Parser (text/voice/photo) ──
export const parseInputWithGemini = async (
  input: GeminiInput,
): Promise<GeminiParsedData[] | null> => {
  try {
    await waitForRateLimit();

    let result;

    if (input.mode === "text") {
      if (!input.text || input.text.trim().length < 2) return null;
      result = await txModel.generateContent(TEXT_PROMPT(input.text));
    } else if (input.mode === "voice") {
      const base64 = Buffer.from(new Uint8Array(input.buffer)).toString("base64");
      result = await txModel.generateContent([
        { inlineData: { mimeType: input.mimeType, data: base64 } },
        VOICE_PROMPT,
      ]);
    } else {
      const base64 = Buffer.from(new Uint8Array(input.buffer)).toString("base64");
      result = await txModel.generateContent([
        { inlineData: { mimeType: input.mimeType, data: base64 } },
        PHOTO_PROMPT,
      ]);
    }

    const responseText = result.response.text();
    if (!responseText) return null;

    const parsed = JSON.parse(responseText);
    const items = Array.isArray(parsed) ? parsed : [parsed];

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
