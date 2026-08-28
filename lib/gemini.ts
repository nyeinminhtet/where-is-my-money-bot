import {
  GoogleGenerativeAI,
  SchemaType,
  ResponseSchema,
} from "@google/generative-ai";
import { env } from "./env";
import { waitForRateLimit } from "./rate-limiter";

const apiKey = env.gemini.apiKey;
const modelName = env.gemini.model;
if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

const genAI = new GoogleGenerativeAI(apiKey);

// ── Transaction Logging Schema ──
const MM_CATEGORIES = [
  "အစားအသောက်", "သွားလာရေး", "အိမ်စရိတ်",
  "မီး/ရေ/အင်တာနက်", "ကျန်းမာရေး", "ဈေးဝယ်ခြင်း",
  "ဖျော်ဖြေရေး", "အခြား",
];

const transactionSchema: ResponseSchema = {
  type: SchemaType.ARRAY,
  description: "Financial transactions extracted from user text.",
  items: {
    type: SchemaType.OBJECT,
    properties: {
      isTransaction: { type: SchemaType.BOOLEAN, description: "True if valid." },
      amount: { type: SchemaType.NUMBER, description: "Amount (convert Myanmar digits)." },
      type: { type: SchemaType.STRING, format: "enum", enum: ["INCOME", "EXPENSE"] },
      category: { type: SchemaType.STRING, format: "enum", enum: MM_CATEGORIES },
      description: { type: SchemaType.STRING, description: "Brief note." },
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
const txModel = genAI.getGenerativeModel(
  { model: modelName, generationConfig: { responseMimeType: "application/json", responseSchema: transactionSchema } },
  { baseUrl: env.gemini.proxyUrl },
);
const intentModel = genAI.getGenerativeModel(
  { model: modelName, generationConfig: { responseMimeType: "application/json", responseSchema: queryIntentSchema } },
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
  type?: "INCOME" | "EXPENSE";
}

// ── Function 1: Text Transaction Parser ──
export const parseTextWithAI = async (
  userText: string,
): Promise<AIParsedTransaction[] | null> => {
  if (!userText || userText.trim().length < 2) return null;
  try {
    await waitForRateLimit();
    const prompt = `Extract all financial transactions from: "${userText}". Convert Myanmar digits (၁၂၃) to English. If multiple, extract each separately. No item name = not a valid transaction.`;
    const result = await txModel.generateContent(prompt);
    const text = result.response.text();
    if (!text) return null;
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error("Gemini AI Parsing Error:", error);
    return null;
  }
};

// ── Function 2: Query Intent Parser ──
export const parseUserQueryIntent = async (userText: string) => {
  if (!userText || userText.trim().length < 2) return null;
  const now = new Date();
  const mm = new Date(now.getTime() + 6.5 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const today = fmt(mm);
  const y = new Date(mm); y.setDate(mm.getDate() - 1);
  const startOfMonth = fmt(new Date(mm.getFullYear(), mm.getMonth(), 1));
  const prevStart = fmt(new Date(mm.getFullYear(), mm.getMonth() - 1, 1));
  const prevEnd = fmt(new Date(mm.getFullYear(), mm.getMonth(), 0));

  try {
    await waitForRateLimit();
    const prompt = `You are a query intent parser for a Myanmar personal finance bot.
[Dynamic Date Context (Myanmar UTC+6:30)] Today: ${today}, Yesterday: ${fmt(y)}, StartOfMonth: ${startOfMonth}, PrevMonth: ${prevStart} to ${prevEnd}
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
