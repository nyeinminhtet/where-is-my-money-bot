import { env } from "@/lib/env";
import { parseUserQueryIntent } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(env.gemini.apiKey);

// Cloudflare Proxy Base URL
const answerModel = genAI.getGenerativeModel(
  {
    model: env.gemini.model,
  },
  {
    baseUrl: env.gemini.proxyUrl,
  },
);

// 🟢 Regex Guard: စရိတ်/ငွေကြေး Keyword မပါပါက AI API မခေါ်ဘဲ တန်းငြင်းရန်
const FINANCE_KEYWORDS =
  /(ဘယ်လောက်|ကုန်|ရ|ဝင်|ထွက်|စာရင်း|ဒီလ|မနေ့က|အသုံးစရိတ်|ကျပ်|စရိတ်|မှတ်|လအလိုက်|သုံး|ငွေ|ကုန်သွား)/i;

export async function processUserAIQuery(userId: string, userText: string) {
  // 1. Guard Layer 1: Regex Keyword Check (0 Token)
  if (!FINANCE_KEYWORDS.test(userText)) {
    return "ကျွန်တော်က မင်းရဲ့ အသုံးစရိတ် စာရင်းတွေကိုပဲ မှတ်ပေးပြီး ပြန်ပြောပြပေးနိုင်တဲ့ Bot ပါဗျ။ 📊 'ဒီလ အစားအသောက်အတွက် ဘယ်လောက် ကုန်လဲ' ဆိုတာမျိုးပဲ မေးလို့ရပါမယ်။";
  }

  // 2. Guard Layer 2: Text Length Check (0 Token)
  if (userText.length > 100) {
    return "မေးခွန်းက ရှည်လွန်းလို့ပါဗျ။ စာရင်းနဲ့ ဆိုင်တာလေးပဲ တိုတိုတုတ်တုတ် မေးပေးပါလား။";
  }

  // 3. Gemini Intent Parsing
  const intent = await parseUserQueryIntent(userText);

  // General Knowledge သို့မဟုတ် စာရင်းနဲ့ မဆိုင်တာ မေးထားပါက တန်းငြင်းမည်
  if (!intent || !intent.isFinanceRelated) {
    return "တောင်းပန်ပါတယ်ဗျ၊ ကျွန်တော်က အသုံးစရိတ်နဲ့ ပိုက်ဆံစာရင်းနဲ့ ဆိုင်တဲ့ မေးခွန်းတွေကိုပဲ ဖြေကြားပေးနိုင်ပါတယ်ဗျ။ ယာယီအားဖြင့် တခြား General မေးခွန်းတွေကို မဖြေပေးနိုင်သေးပါဘူး။";
  }

  // 4. Prisma Dynamic Database Querying
  const whereClause: any = { userId };

  if (intent.startDate || intent.endDate) {
    whereClause.createdAt = {};
    if (intent.startDate)
      whereClause.createdAt.gte = new Date(intent.startDate);
    if (intent.endDate)
      whereClause.createdAt.lte = new Date(intent.endDate + "T23:59:59.999Z");
  }

  if (intent.type) {
    whereClause.type = intent.type;
  }

  if (intent.category) {
    whereClause.category = {
      contains: intent.category,
      mode: "insensitive",
    };
  }

  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: 20, // Max 20 items to prevent huge prompt tokens
  });

  if (transactions.length === 0) {
    return "ရှာဖွေမှုနဲ့ ကိုက်ညီတဲ့ စာရင်း မတွေ့ရှိပါဘူးဗျ။";
  }

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  // 5. Final Answer Generation
  const answerPrompt = `
User requested: "${userText}"
Extracted Data Summary:
- Total Transactions Found: ${transactions.length}
- Total Calculated Amount: ${totalAmount} MMK
- Transactions List: ${JSON.stringify(
    transactions.map((t) => ({
      amount: t.amount,
      category: t.category,
      desc: t.description,
      date: t.createdAt.toISOString().split("T")[0],
    })),
  )}

Instruction: Answer the user politely in Burmese as a friendly personal finance assistant based ONLY on the provided transaction data above. Keep it concise, helpful, and natural. Do NOT answer anything outside of this data.
`;

  const finalResponse = await answerModel.generateContent(answerPrompt);
  return finalResponse.response.text();
}
