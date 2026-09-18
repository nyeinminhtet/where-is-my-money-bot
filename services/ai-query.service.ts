import { prisma } from "@/lib/prisma";
import { parseUserQueryIntent, getAnswerModel } from "@/lib/ai/gemini";
import { getTranslation } from "@/lib/i18n";

const answerModel = getAnswerModel();

export const processUserAIQuery = async (
  userId: string,
  userText: string,
  language: string = "mm",
) => {
  // 1. Gemini Intent Parsing
  const intent = await parseUserQueryIntent(userText);
  if (!intent || !intent.isFinanceRelated) {
    return getTranslation(language, "AI_NOT_FINANCE");
  }
  // Prisma Dynamic Where Clause Construction
  const whereClause: any = { userId };
  if (intent.startDate || intent.endDate) {
    whereClause.createdAt = {};
    if (intent.startDate) {
      whereClause.createdAt.gte = new Date(`${intent.startDate}T00:00:00.000Z`);
    }
    if (intent.endDate) {
      whereClause.createdAt.lte = new Date(`${intent.endDate}T23:59:59.999Z`);
    }
  }
  if (intent.type) {
    whereClause.type = intent.type;
  }
  // Specific Category/Keyword Filter (only applied when explicitly extracted)
  const searchConditions: any[] = [];
  const isValidValue = (val: string | null | undefined): val is string =>
    typeof val === "string" &&
    val.toLowerCase() !== "null" &&
    val.trim() !== "";
  if (isValidValue(intent.category)) {
    searchConditions.push({ category: { equals: intent.category.trim() } });
  }
  if (isValidValue(intent.searchKeyword)) {
    searchConditions.push({
      description: {
        contains: intent.searchKeyword.trim(),
        mode: "insensitive",
      },
    });
  }
  if (searchConditions.length > 0) {
    whereClause.AND = [...(whereClause.AND || []), { OR: searchConditions }];
  }
  // Fetch Transactions
  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  if (transactions.length === 0) {
    return getTranslation(language, "AI_NO_RESULTS");
  }
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  // Answer Generation Prompt with Language Support
  const languageInstruction =
    language === "en"
      ? "Respond in English. Be polite and concise."
      : "Speak strictly as a polite MALE assistant in Burmese language. Mandatory Endings: Use 'ပါဗျာ', 'ပါဗျ', 'ခင်ဗျာ', 'နော်'. NEVER use female particles.";

  const answerPrompt = `
User asked: "${userText}"
Data Context:
- Total Transactions: ${transactions.length}
- Total Sum Amount: ${totalAmount} MMK
- Transactions List: ${JSON.stringify(
    transactions.map((t) => ({
      amount: t.amount,
      type: t.type,
      category: t.category,
      desc: t.description,
      date: t.createdAt.toISOString().split("T")[0],
    })),
  )}

Persona & Tone Guidelines:
1. ${languageInstruction}
2. State the calculated total amount clearly (${totalAmount} MMK) and summarize the items briefly.
`;
  const finalResponse = await answerModel.generateContent(answerPrompt);
  return finalResponse.response.text();
};
