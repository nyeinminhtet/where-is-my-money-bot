import {
  GoogleGenerativeAI,
  SchemaType,
  ResponseSchema,
} from "@google/generative-ai";
import { env } from "./env";

export interface AIParsedTransaction {
  isTransaction: boolean;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string;
}

export interface QueryIntent {
  isFinanceRelated: boolean;
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: "INCOME" | "EXPENSE";
}

const apiKey = env.gemini.apiKey;
const modelName = env.gemini.model;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

const transactionSchema: ResponseSchema = {
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

const queryIntentSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  description: "Extracted intent for user's transaction search query.",
  properties: {
    isFinanceRelated: {
      type: SchemaType.BOOLEAN,
      description:
        "True if asking about transactions/finance, false for general questions.",
    },
    startDate: {
      type: SchemaType.STRING,
      description: "Start date in YYYY-MM-DD format or null if not specified.",
    },
    endDate: {
      type: SchemaType.STRING,
      description: "End date in YYYY-MM-DD format or null if not specified.",
    },
    category: {
      type: SchemaType.STRING,
      description: "Matching category from standard list or query keyword.",
    },
    type: {
      type: SchemaType.STRING,
      format: "enum",
      enum: ["INCOME", "EXPENSE"],
      description: "Transaction type if asked.",
    },
  },
  required: ["isFinanceRelated"],
};

// Models Initializations
const transactionModel = genAI.getGenerativeModel(
  {
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: transactionSchema,
    },
  },
  { baseUrl: "https://muddy-sun-be07.nyeinmg904.workers.dev" },
);

const queryIntentModel = genAI.getGenerativeModel(
  {
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: queryIntentSchema,
    },
  },
  { baseUrl: "https://muddy-sun-be07.nyeinmg904.workers.dev" },
);

export async function parseTextWithAI(
  userText: string,
): Promise<AIParsedTransaction[] | null> {
  if (!userText || userText.trim().length < 2) return null;

  try {
    const prompt = `Extract all financial transactions from this text: "${userText}". 
  If multiple transactions are present, extract each one separately into the array.
  Convert Myanmar digits (၁၂၃) to English numbers.
  If no item name is provided for a number, do NOT mark it as a valid transaction.`;

    const result = await transactionModel.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) return null;

    const transactions = JSON.parse(responseText);
    return Array.isArray(transactions) ? transactions : [transactions];
  } catch (error) {
    console.error("Gemini AI Parsing Error:", error);
    return null;
  }
}

// 🟢 Function 2: Query Intent သီးသန့် Parse ပေးရန် Function အသစ်
export async function parseUserQueryIntent(
  userText: string,
  currentDateStr: string = new Date().toISOString().split("T")[0],
): Promise<QueryIntent | null> {
  if (!userText || userText.trim().length < 2) return null;

  try {
    const prompt = `You are a query intent parser for a personal finance bot.
Current Date: ${currentDateStr}.

Rules:
1. ONLY mark "isFinanceRelated": true if the prompt is asking about transaction history, expenses, income, or totals.
2. If the prompt is asking general knowledge, advice, coding, or chit-chat, set "isFinanceRelated": false.
3. Calculate relative dates like "ဒီလ", "မနေ့က", "ယခုလ", "ဒီအပတ်" based on current date ${currentDateStr}.

Analyze user text: "${userText}"`;

    const result = await queryIntentModel.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) return null;

    return JSON.parse(responseText) as QueryIntent;
  } catch (error) {
    console.error("Gemini Query Intent Error:", error);
    return null;
  }
}
