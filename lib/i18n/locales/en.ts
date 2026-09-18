export const en = {
  // Bot commands
  START_WELCOME:
    '👋 Hello *{name}*!\n\n🚀 Welcome to **Where Is My Money**.\n\nManage your daily finances easily with AI assistance on Telegram.\n\n💡 **Ways to get started -**\n1️⃣ **🤖 AI Smart Auto-Log:** Type naturally in chat (e.g. "Breakfast 1500" or "Freelance 500000"). AI will automatically categorize and log transactions.\n2️⃣ **📱 Open Dashboard:** Click the **"Open Mini App"** button below to view Visual Charts and Full Analytics.\n\n⚡ *Try it now by typing "Breakfast 1500"*!',

  HELP_MESSAGE:
    "💡 **Bot Usage Guide**\n\nThis bot helps you quickly log your income/expenses.\n\n━━━━━━━━━━━━━━━━━━━━\n✨ **1. How to Log Transactions (Quick AI & Manual)**\n━━━━━━━━━━━━━━━━━━━━\n• **Text Message (AI Mode):**\n  *(e.g. `15000 dinner` or `taxi fare 3000`)*\n• **Log Multiple Transactions:**\n  *(e.g. `2000 tea 1000 snacks`)*\n• **Manual Amount Entry:**\n  *(e.g. type `1000` to select income/expense)*\n\n━━━━━━━━━━━━━━━━━━━━\n📌 **2. Menu Buttons & Commands**\n━━━━━━━━━━━━━━━━━━━━\n• `/start` - Restart the bot\n• `/balance` - Check current balance\n• `/today` - View today's expenses\n• `/monthly` - View monthly expenses\n• `/previous_month` - View last month's expenses\n• `/yearly` - View yearly expenses\n• `/set_budget` - Set monthly budget 🎯\n• `/check_budget` - Check budget status 📊\n• `/language` - Switch language 🌐\n• `/help` - View this guide\n\n💬 If you have any issues, please check the message format.",

  // Balance
  BALANCE_HEADER: "📊 **Current Balance**\n\n",
  BALANCE_NET: "💰 **NET BALANCE:** {amount}",
  BALANCE_CARRIED_FORWARD: "*(Carried forward: {amount})*",
  BALANCE_INCOME: "📈 **This Month Income:** +{amount}",
  BALANCE_EXPENSE: "📉 **This Month Expenses:** -{amount}",

  // Today
  TODAY_HEADER: "📅 **Today's Summary**\n---------------------------------",
  TODAY_INCOME: "💰 Total Income - {amount}",
  TODAY_EXPENSE: "💸 Total Expenses - {amount}",
  TODAY_DETAIL_HEADER: "📝 Today's Details:",
  TODAY_NO_TRANSACTIONS: "❌ No transactions recorded today.",
  TODAY_ITEM: "{icon} {amount} - {description}",

  // Monthly
  MONTHLY_HEADER: "📅 {year} / {month} Monthly Report",
  MONTHLY_INCOME: "💰 Income: {amount}",
  MONTHLY_EXPENSE: "💸 Expenses: {amount}",
  MONTHLY_BALANCE: "💵 Balance: {amount}",

  // Previous Month
  PREV_MONTH_HEADER: "📅 {year} / {month} Monthly Report\n---------------------------------",
  PREV_MONTH_INCOME: "💰 Total Income: {amount}",
  PREV_MONTH_EXPENSE: "💸 Total Expenses: {amount}",
  PREV_MONTH_BALANCE: "💵 Total Balance: {amount}",

  // Yearly
  YEARLY_HEADER: "📅 {year} Yearly Report",
  YEARLY_INCOME: "💰 Income: {amount}",
  YEARLY_EXPENSE: "💸 Expenses: {amount}",
  YEARLY_BALANCE: "💵 Balance: {amount}",
  YEARLY_MONTHLY_BREAKDOWN: "--- 📈 Monthly Breakdown ---",
  YEARLY_MONTH_ITEM: "📅 {month}: 💰 +{income} | 💸 -{expense}",

  // Category Breakdown
  CATEGORY_BREAKDOWN_HEADER: "\n--- 📊 Category Breakdown ---",
  CATEGORY_BREAKDOWN_ITEM: "• {category}: {amount} ({percent}%)",
  CATEGORY_BREAKDOWN_INCOME_HEADER: "\n--- 📊 Income Breakdown ---",

  // Transaction Summary
  TX_SAVED: "✅ **Transaction Saved!**",
  TX_TYPE: "📌 Type - {type}",
  TX_CATEGORY: "📂 Category - {category}",
  TX_AMOUNT: "💰 Amount - {amount}",
  TX_NOTE: "📝 Note - {note}",
  TX_BALANCE: "💵 **Balance - {amount}**",
  TX_CARRIED_FORWARD: "*(Carried forward: {amount})*",
  TYPE_INCOME: "Income",
  TYPE_EXPENSE: "Expense",
  NOTE_NONE: "None",

  // Undo
  UNDO_BUTTON: "🗑️ Undo",
  UNDO_LEGACY: "⚠️ This is an old entry from before the system migration. It cannot be undone from the bot.",
  UNDO_NOT_FOUND: "⚠️ This transaction has already been deleted or no longer exists.",
  UNDO_DELETED: "🗑️ {description} ({amount}) has been deleted!",

  // Amount / Type / Category flow
  AMOUNT_PROMPT: "💰 Please enter a valid amount.",
  TYPE_PROMPT: "💰 Select Income / Expense:",
  TYPE_INVALID: "⚠️ Invalid type selected.",
  CATEGORY_PROMPT: "📂 Select a category:",
  CATEGORY_INVALID: "⚠️ Invalid category.",
  CATEGORY_NO_TYPE: "⚠️ Transaction type not set.",
  DESCRIPTION_PROMPT: "📝 Enter description (or skip):",
  DESCRIPTION_SKIP: "⏩ Skip",
  SESSION_INCOMPLETE: "⚠️ Transaction data is incomplete. Please try again.",

  // Budget
  BUDGET_SET: "✅ Monthly budget set to **{amount}**.",
  BUDGET_ASK: "💰 Please enter your desired monthly budget amount in numbers (e.g. 300000).",
  BUDGET_NOT_SET: "⚠️ Monthly budget not set yet.\n⚙️ Please set it first using the 'Set Budget' button.",
  BUDGET_STATUS_HEADER: "📊 **Your Monthly Budget Status**\n---------------------------------",
  BUDGET_STATUS_BUDGET: "💰 Budget: {amount}",
  BUDGET_STATUS_USED: "📉 Used: {amount} ({percent}%)",
  BUDGET_STATUS_REMAINING: "💵 Remaining: {amount}",
  BUDGET_WARNING_80: "\n\n⚠️ **Warning:** You've used over 80% of this month's budget. Please spend carefully.",
  BUDGET_WARNING_100: "\n\n🚨 **Warning:** This month's budget has been reached/exceeded. 📉",
  BUDGET_HEADER: "📊 **Monthly Budget Status:**",
  BUDGET_USED_LINE: "- Used: {amount} / {budget} ({percent}%)",

  // Voice / Photo
  VOICE_SAVED: "✅ Voice transaction saved!",
  VOICE_NO_RESULTS: "🎤 No transaction found in the audio. Please mention the amount and what it was for.",
  VOICE_FETCH_ERROR: "⚠️ Could not download voice file. Please try again.",
  VOICE_PROCESS_ERROR: "⚠️ Error processing voice file. Please try again.",
  VOICE_DEFAULT_DESC: "Recorded via voice",

  PHOTO_SAVED: "✅ Photo transaction saved!",
  PHOTO_NO_RESULTS: "🧾 No transaction found in the photo. Please take a clear photo of the bill or receipt.",
  PHOTO_FETCH_ERROR: "⚠️ Could not download photo. Please try again.",
  PHOTO_PROCESS_ERROR: "⚠️ Error processing photo. Please try again.",
  PHOTO_DEFAULT_DESC: "Recorded via photo",

  // AI
  AI_QUOTA_EXCEEDED:
    "Sorry, you've reached the daily AI query limit (10 times). Try again tomorrow. For now, you can use the manual keyboard buttons.",
  AI_NOT_FINANCE:
    "I can only answer questions related to expenses and finances. 📊",
  AI_NO_RESULTS: "No transactions found matching your search.",
  AI_ERROR:
    "⚠️ The AI system is temporarily unavailable. Please try again later.",

  // Help pattern (fallback)
  HELP_PATTERN:
    "💡 **How to use the Bot**\n\n1️⃣ **AI Auto-Log:** Just type naturally (e.g. \"Breakfast 1500\" or \"Taxi 5000\")\n2️⃣ **AI Query:** Ask questions like \"How much did I spend on food this month?\"\n3️⃣ **Manual Mode:** Type just a number (e.g. \"1000\") to select income/expense manually.",

  // Not a transaction
  NOT_A_TRANSACTION:
    "🤖 I'm an expense tracking bot. 📊 To log, type \"Breakfast 1500\" or ask \"How much did I spend this month?\".",

  // AI Rate Limit (bot.ts)
  AI_RATE_LIMIT:
    "⚠️ AI rate limit reached. Please wait a moment and try again.",

  // Language
  LANGUAGE_PROMPT: "🌍 Select your preferred language:",
  LANGUAGE_CHANGED_EN: "✅ Language changed to English.",
  LANGUAGE_CHANGED_MM: "✅ Language changed to Myanmar.",

  // Cron Reminder
  CRON_REMINDER:
    "💸 **Where did your money go today?**\n\nLog your expenses before you forget! 😉\n\n*(Just type and send)*",

  // Menu
  MENU_BALANCE: "💰 Balance",
  MENU_TODAY: "📅 Today",
  MENU_MONTHLY: "📅 Monthly",
  MENU_PREVIOUS_MONTH: "📅 Previous Month",
  MENU_YEARLY: "📆 Yearly",
  MENU_SET_BUDGET: "⚙️ Set Budget",
  MENU_CHECK_BUDGET: "📊 Check Budget",

  // Mini App / Dashboard
  GREETING_MORNING: "Good Morning",
  GREETING_AFTERNOON: "Good Afternoon",
  GREETING_EVENING: "Good Evening",
  NET_BALANCE: "Net Balance",
  CARRIED_FORWARD: "(Carried forward: +{amount} Ks)",
  TOTAL_INCOME: "Total Income",
  TOTAL_EXPENSE: "Total Expense",
  HISTORY: "History",
  ANALYTICS: "Analytics",
  NO_TRANSACTIONS: "No transactions yet",
  LOADING: "Loading...",
  ADD_TRANSACTION: "Add Transaction",
  EDIT_TRANSACTION: "Edit Transaction",
  DELETE: "Delete",
  SAVE: "Save",
  CANCEL: "Cancel",
  AMOUNT: "Amount",
  CATEGORY: "Category",
  TYPE: "Type",
  DESCRIPTION: "Description",
  INCOME: "Income",
  EXPENSE: "Expense",
  BUDGET: "Budget",
  REMAINING: "Remaining",
  USED: "Spent",
  MONTH: "Month",
  YEAR: "Year",
  TRANSACTIONS: "Transactions",
  TOTAL: "Total",
  ERROR_GENERIC: "❌ An error occurred. Please try again.",
  BUDGET_EXCEEDED: "🚨 Budget exceeded!",
  YESTERDAY: "Yesterday",
  ITEMS_COUNT: "{count} items",
  ALL: "All",
  SEARCH_PLACEHOLDER: "Search transactions...",
  SELECT_CATEGORY: "Select a category",
  BUDGET_LABEL: "Budget",
  SPENT_LABEL: "Spent:",
  CURRENCY: "Ks",

  // Categories - Income
  CAT_SALARY: "Salary",
  CAT_BUSINESS: "Business",
  CAT_FREELANCE: "Freelance",
  CAT_GIFT: "Gift",
  CAT_INVESTMENT: "Investment",
  CAT_OTHER: "Other",

  // Categories - Expense
  CAT_FOOD: "Food & Drink",
  CAT_TRANSPORT: "Transport",
  CAT_RENT: "Rent",
  CAT_UTILITIES: "Utilities",
  CAT_HEALTH: "Health",
  CAT_SHOPPING: "Shopping",
  CAT_EDUCATION: "Education",
  CAT_ENTERTAINMENT: "Entertainment",
  CAT_FAMILY: "Family",

  // Month names (short)
  MONTH_JAN: "Jan",
  MONTH_FEB: "Feb",
  MONTH_MAR: "Mar",
  MONTH_APR: "Apr",
  MONTH_MAY: "May",
  MONTH_JUN: "Jun",
  MONTH_JUL: "Jul",
  MONTH_AUG: "Aug",
  MONTH_SEP: "Sep",
  MONTH_OCT: "Oct",
  MONTH_NOV: "Nov",
  MONTH_DEC: "Dec",

  // Month names (full)
  MONTH_FULL_JAN: "January",
  MONTH_FULL_FEB: "February",
  MONTH_FULL_MAR: "March",
  MONTH_FULL_APR: "April",
  MONTH_FULL_MAY: "May",
  MONTH_FULL_JUN: "June",
  MONTH_FULL_JUL: "July",
  MONTH_FULL_AUG: "August",
  MONTH_FULL_SEP: "September",
  MONTH_FULL_OCT: "October",
  MONTH_FULL_NOV: "November",
  MONTH_FULL_DEC: "December",

  // Delete confirmation
  DELETE_CONFIRM_TITLE: "Delete?",
  DELETE_CONFIRM_MESSAGE: "This transaction has already been deleted or no longer exists.",
} as const;

export type TranslationKey = keyof typeof en;
