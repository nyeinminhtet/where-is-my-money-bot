import {
  GoogleGenerativeAI,
  SchemaType,
  ResponseSchema,
} from "@google/generative-ai";
import { env } from "./env";

const apiKey = env.gemini.apiKey;
const modelName = env.gemini.model;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

const schema: ResponseSchema = {
  type: SchemaType.ARRAY,
  description: "List of financial transactions extracted from user text.",
  items: {
    type: SchemaType.OBJECT,
    properties: {
      isTransaction: {
        type: SchemaType.BOOLEAN,
        description: "True if valid transaction, false otherwise.",
      },
      amount: {
        type: SchemaType.NUMBER,
        description: "Transaction amount (convert Myanmar digits to numbers).",
      },
      type: {
        type: SchemaType.STRING,
        format: "enum",
        enum: ["INCOME", "EXPENSE"],
        description: "Transaction type.",
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
        description: "Matching category.",
      },
      description: {
        type: SchemaType.STRING,
        description: "Brief note or item name.",
      },
    },
    required: ["isTransaction", "amount", "type", "category"],
  },
};

const model = genAI.getGenerativeModel(
  {
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  },

  { baseUrl: "https://muddy-sun-be07.nyeinmg904.workers.dev" },
);

export interface AIParsedTransaction {
  isTransaction: boolean;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string;
}

export async function parseTextWithAI(
  userText: string,
): Promise<AIParsedTransaction[] | null> {
  if (!userText || userText.trim().length < 2) return null;

  try {
    const prompt = `Extract all financial transactions from this text: "${userText}". 
  If multiple transactions are present, extract each one separately into the array.
  Convert Myanmar digits (၁၂၃) to English numbers.
  If no item name is provided for a number, do NOT mark it as a valid transaction.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) return null;

    const transactions = JSON.parse(responseText);
    return Array.isArray(transactions) ? transactions : [transactions];
  } catch (error) {
    console.error("Gemini AI Parsing Error:", error);
    return null;
  }
}
