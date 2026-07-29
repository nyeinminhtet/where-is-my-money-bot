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

// 1. Transaction Logging Schema
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

// 2. Query Intent Parsing Schema
const queryIntentSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  description: "Extracted intent for user's transaction search query.",
  properties: {
    isFinanceRelated: {
      type: SchemaType.BOOLEAN,
      description:
        "True if asking about transaction history, expenses, income, budget, or totals.",
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
      description:
        "Match strictly to one of the predefined categories, or null if general search.",
    },
    searchKeyword: {
      type: SchemaType.STRING,
      description:
        "Specific item, keyword, or description name to search inside descriptions (e.g., 'ကော်ဖီ', 'ကားခ').",
    },
    type: {
      type: SchemaType.STRING,
      format: "enum",
      enum: ["INCOME", "EXPENSE"],
      description:
        "INCOME if user explicitly asks for income/earnings, EXPENSE if asking for spendings/costs.",
    },
  },
  required: ["isFinanceRelated"],
};

// Generative Models Initialization with Proxy
const transactionModel = genAI.getGenerativeModel(
  {
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: transactionSchema,
    },
  },
  { baseUrl: env.gemini.proxyUrl },
);

const queryIntentModel = genAI.getGenerativeModel(
  {
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: queryIntentSchema,
    },
  },
  { baseUrl: env.gemini.proxyUrl },
);

// Types Export
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

// Function 1: Transaction Logging Parser
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

// Function 2: Query Intent Parser with Dynamic Myanmar Timezone Calculation
export async function parseUserQueryIntent(userText: string) {
  if (!userText || userText.trim().length < 2) return null;

  const now = new Date();
  const mmTime = new Date(now.getTime() + 6.5 * 60 * 60 * 1000);
  const todayStr = mmTime.toISOString().split("T")[0];

  const yesterday = new Date(mmTime);
  yesterday.setDate(mmTime.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const startOfMonth = new Date(mmTime.getFullYear(), mmTime.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const prevMonthStart = new Date(
    mmTime.getFullYear(),
    mmTime.getMonth() - 1,
    1,
  )
    .toISOString()
    .split("T")[0];
  const prevMonthEnd = new Date(mmTime.getFullYear(), mmTime.getMonth(), 0)
    .toISOString()
    .split("T")[0];

  try {
    const prompt = `You are a query intent parser for a Myanmar personal finance bot.

[Dynamic Date Context (Myanmar Time UTC+6:30)]
- Today: ${todayStr}
- Yesterday: ${yesterdayStr}
- Start of Current Month: ${startOfMonth}
- Previous Month Range: ${prevMonthStart} to ${prevMonthEnd}

[Allowed Standard Categories]
- EXPENSE: ["အစားအသောက်", "သွားလာရေး", "အိမ်ငှားခ", "မီး/ရေ/အင်တာနက်", "ကျန်းမာရေး", "ဈေးဝယ်ခြင်း", "ပညာရေး", "ဖျော်ဖြေရေး", "မိသားစု", "အခြား"]
- INCOME: ["လစာ", "စီးပွားရေး", "Freelance", "လက်ဆောင်", "ရင်းနှီးမြှုပ်နှံမှု", "အခြား"]

[CRITICAL RULES FOR CATEGORY & KEYWORD]
1. GENERAL TOTAL SPENDING/INCOME QUESTIONS:
   If user asks generally about spending, income, or totals (e.g., "ဒီနေ့ ဘယ်လောက် ကုန်လဲ", "မနေ့က ဘယ်လောက်ဝင်လဲ ပိုက်ဆံ", "How much money did I spend?"):
   -> YOU MUST SET 'category': null AND 'searchKeyword': null.

2. IGNORE GENERIC FINANCIAL TERMS (CRITICAL):
   - NEVER set words like "ပိုက်ဆံ", "ငွေ", "money", "ဝင်ငွေ", "ထွက်ငွေ", "စရိတ်" as 'searchKeyword' or 'category'. These are generic financial terms, NOT specific transaction items!

3. SPECIFIC CATEGORY/ITEM QUESTIONS:
   Only set 'category' or 'searchKeyword' if the user explicitly mentions a specific item or category (e.g., "မုန့်စား", "ကော်ဖီ", "ကားခ", "snacks", "coffee").

4. INTENT DETECTION:
   - Set "isFinanceRelated": true for any questions asking about money spent, income, totals, or daily transactions (in Burmese, English, or Singlish).
   
User text: "${userText}"`;

    const result = await queryIntentModel.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) return null;

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini Query Intent Error:", error);
    return null;
  }
}
