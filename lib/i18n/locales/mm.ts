export const mm = {
  // Bot commands
  START_WELCOME:
    '👋 မင်္ဂလာပါ *{name}*!\n\n🚀 **Where Is My Money** မှ လှိုက်လှဲစွာ ကြိုဆိုပါတယ်။\n\nနေ့စဉ် ဘဏ္ဍာရေး စာရင်းတွေကို AI ရဲ့ အကူအညီနဲ့ Telegram ကနေ အလွယ်တကူ စီမံခန့်ခွဲလိုက်ပါ။\n\n💡 **စတင်အသုံးပြုနိုင်သည့် နည်းလမ်းများ -**\n1️⃣ **🤖 AI Smart Auto-Log:** Chat ထဲမှာ စကားပြောသလို ရိုက်ပါ (ဥပမာ - "မနက်စာ ၁၅၀၀ ကုန်တယ်" သို့မဟုတ် "Freelance ၅၀၀၀၀ ရတယ်")။ AI က ပမာဏနဲ့ Category များကို အလိုအလျောက် ခွဲခြား စာရင်းသွင်းပေးပါလိမ့်မည်။\n2️⃣ **📱 Open Dashboard:** အောက်က **"Open Mini App"** Button ကို နှိပ်ပြီး Visual Charts နဲ့ Full Analytics များကို ကြည့်ရှုပါ။\n\n⚡ *အခုပဲ "မနက်စာ ၁၅၀၀ ကုန်တယ်" လို့ ရိုက်ထည့်ပြီး စမ်းသပ်ကြည့်လိုက်ပါ!*',

  HELP_MESSAGE:
    "💡 **Bot အသုံးပြုနည်း လမ်းညွှန်**\n\nဒီ Bot လေးဟာ သင့်ရဲ့ ဝင်ငွေ/ထွက်ငွေ စာရင်းများကို လွယ်ကူလျင်မြန်စွာ မှတ်သားပေးနိုင်ပါတယ်။\n\n━━━━━━━━━━━━━━━━━━━━\n✨ **၁။ စာရင်းသွင်းနည်းများ (Quick AI & Manual)**\n━━━━━━━━━━━━━━━━━━━━\n• **စာတို ရိုက်ပို့၍ သွင်းခြင်း (AI Mode):**\n  *(ဥပမာ - `၁၅၀၀၀ ညစာ` သို့မဟုတ် `ကားခ ၃၀၀၀`)*\n• **စာရင်းများစွာ တစ်ပြိုင်နက် သွင်းခြင်း:**\n  *(ဥပမာ - `2000 အချိုရည် ၁၀၀၀ အကင်`)*\n• **ပမာဏ သီးသန့် ရိုက်ပို့ခြင်း:**\n  *(ဥပမာ - `1000` သို့မဟုတ် `၁၀၀၀` ရိုက်ပို့ပါက ဝင်ငွေ/ထွက်ငွေ ရွေးချယ်နိုင်သော ခလုတ်ပေါ်လာပါမည်)*\n\n━━━━━━━━━━━━━━━━━━━━\n📌 **၂။ Menu ခလုတ်များနှင့် Command များ**\n━━━━━━━━━━━━━━━━━━━━\n• `/start` - Bot ကို ပြန်လည် စတင်ရန်\n• `/balance` - လက်ကျန် ငွေပမာဏ စစ်ဆေးရန်\n• `/today` - ဒီနေ့ သုံးစွဲမှု စာရင်းကြည့်ရန်\n• `/monthly` - ဒီလ သုံးစွဲမှု စာရင်းကြည့်ရန်\n• `/previous_month` - ပြီးခဲ့သောလ စာရင်းကြည့်ရန်\n• `/yearly` - ဒီနှစ် သုံးစွဲမှု စာရင်းကြည့်ရန်\n• `/set_budget` - လစဉ် သုံးစွဲမည့် ဘတ်ဂျက် သတ်မှတ်ရန် 🎯\n• `/check_budget` - သတ်မှတ်ထားသော ဘတ်ဂျက် စစ်ဆေးရန် 📊\n• `/language` - ဘာသာစကား ပြောင်းရန် 🌐\n• `/help` - အသုံးပြုနည်း ပြန်ကြည့်ရန်\n\n💬 စာရင်းသွင်းရာတွင် အဆင်မပြေမှုရှိပါက စာသားပုံစံ ပြန်လည်စစ်ဆေးပေးပါဗျာ။",

  // Balance
  BALANCE_HEADER: "📊 **လက်ရှိ ငွေစာရင်း အခြေအနေ**\n\n",
  BALANCE_NET: "💰 **NET BALANCE:** {amount}",
  BALANCE_CARRIED_FORWARD: "*(ယခင်လများမှ ကျန်ငွေ: {amount})*",
  BALANCE_INCOME: "📈 **ဒီလ ဝင်ငွေ:** +{amount}",
  BALANCE_EXPENSE: "📉 **ဒီလ ထွက်ငွေ:** -{amount}",

  // Today
  TODAY_HEADER: "📅 ဒီနေ့ စာရင်းအကျဉ်းချုပ်\n---------------------------------",
  TODAY_INCOME: "💰 ဝင်ငွေစုစုပေါင်း - {amount}",
  TODAY_EXPENSE: "💸 ထွက်ငွေစုစုပေါင်း - {amount}",
  TODAY_DETAIL_HEADER: "📝 ယနေ့သုံးစွဲမှု အသေးစိတ်:",
  TODAY_NO_TRANSACTIONS: "❌ ယနေ့အတွင်း စာရင်းသွင်းထားခြင်း မရှိသေးပါ။",
  TODAY_ITEM: "{icon} {amount} - {description}",

  // Monthly
  MONTHLY_HEADER: "📅 {year} / {month} လစာရင်း",
  MONTHLY_INCOME: "💰 ဝင်ငွေ: {amount}",
  MONTHLY_EXPENSE: "💸 ထွက်ငွေ: {amount}",
  MONTHLY_BALANCE: "💵 လက်ကျန်: {amount}",

  // Previous Month
  PREV_MONTH_HEADER:
    "📅 {year} ခုနှစ် / {month} လပိုင်း စာရင်းချုပ်\n---------------------------------",
  PREV_MONTH_INCOME: "💰 ဝင်ငွေစုစုပေါင်း: {amount}",
  PREV_MONTH_EXPENSE: "💸 ထွက်ငွေစုစုပေါင်း: {amount}",
  PREV_MONTH_BALANCE: "💵 လက်ကျန်စုစုပေါင်း: {amount}",

  // Yearly
  YEARLY_HEADER: "📅 {year} ခုနှစ် နှစ်ချုပ်စာရင်း",
  YEARLY_INCOME: "💰 ဝင်ငွေ: {amount}",
  YEARLY_EXPENSE: "💸 ထွက်ငွေ: {amount}",
  YEARLY_BALANCE: "💵 လက်ကျန်: {amount}",
  YEARLY_MONTHLY_BREAKDOWN: "--- 📈 လအလိုက် အနှစ်ချုပ် ---",
  YEARLY_MONTH_ITEM: "📅 {month} လပိုင်း: 💰 +{income} | 💸 -{expense}",

  // Category Breakdown
  CATEGORY_BREAKDOWN_HEADER: "\n--- 📊 Category အလိုက် ---",
  CATEGORY_BREAKDOWN_ITEM: "• {category}: {amount} ({percent}%)",
  CATEGORY_BREAKDOWN_INCOME_HEADER: "\n--- 📊 ဝင်ငွေ Category အလိုက် ---",

  // Transaction Summary
  TX_SAVED: "✅ **စာရင်းသွင်းပြီးပါပြီ။**",
  TX_TYPE: "📌 အမျိုးအစား - {type}",
  TX_CATEGORY: "📂 ကဏ္ဍ - {category}",
  TX_AMOUNT: "💰 ပမာဏ - {amount}",
  TX_NOTE: "📝 မှတ်ချက် - {note}",
  TX_BALANCE: "💵 **လက်ကျန်ငွေ - {amount}**",
  TX_CARRIED_FORWARD: "*(ယခင်လများမှ ကျန်ငွေ: {amount})*",
  TYPE_INCOME: "ဝင်ငွေ",
  TYPE_EXPENSE: "ထွက်ငွေ",
  NOTE_NONE: "မရှိပါ",

  // Undo
  UNDO_BUTTON: "🗑️ ပြန်ဖျက်မည်",
  UNDO_LEGACY:
    "⚠️ ဒီစာရင်းက စနစ်မပြောင်းခင်က စာရင်းအဟောင်းဖြစ်တဲ့အတွက် Bot ထဲကနေ လှမ်းဖျက်လို့ မရတော့ပါ။",
  UNDO_NOT_FOUND:
    "⚠️ ဒီစာရင်းက ဖျက်ပြီးသား ဖြစ်နေပါသည် (သို့မဟုတ် မရှိတော့ပါ)၊",
  UNDO_DELETED: "🗑️ {description} ({amount}) စာရင်းဖျက်လိုက်ပါပြီ!",

  // Amount / Type / Category flow
  AMOUNT_PROMPT: "ကျေးဇူးပြု၍ မှန်ကန်သော ငွေပမာဏ ထည့်ပါ။",
  TYPE_PROMPT: "💰 ဝင်ငွေ / ထွက်ငွေ ရွေးပါ။",
  TYPE_INVALID: "⚠️ မမှန်ကန်သော အမျိုးအစား ရွေးထားပါသည်။",
  CATEGORY_PROMPT: "📂 အမျိုးအစားခွဲ ရွေးပါ။",
  CATEGORY_INVALID: "⚠️ အမျိုးအစား မမှန်ပါ။",
  CATEGORY_NO_TYPE: "⚠️ ဝင်ငွေ / ထွက်ငွေ မရှိပါ။",
  DESCRIPTION_PROMPT: "📝 အသေးစိတ်ဖော်ပြချက် ထည့်ပါ (သို့မဟုတ် ကျော်ပါ)။",
  DESCRIPTION_SKIP: "⏩ ကျော်မည်",
  SESSION_INCOMPLETE: "ငွေစာရင်းအချက်အလက် မပြည့်စုံပါ။ ထပ်မံကြိုးစားပါ။",

  // Budget
  BUDGET_SET:
    "✅ ယခုလအတွက် လစဉ် အသုံးစရိတ်ကို **{amount}** အဖြစ် သတ်မှတ်ပေးလိုက်ပါပြီ။ 💪",
  BUDGET_ASK:
    "💰 ကျေးဇူးပြု၍ သင်သတ်မှတ်လိုသော လစဉ် Budget ပမာဏကို ဂဏန်းသီးသန့်ဖြင့် ရိုက်ထည့်ပေးပါ (ဥပမာ- 300000)။",
  BUDGET_NOT_SET:
    "⚠️ လစဉ် အသုံးစရိတ် မသတ်မှတ်ရသေးပါ။\n⚙️ 'အသုံးစရိတ် သတ်မှတ်ရန်' ခလုတ်ကို နှိပ်ပြီး အရင်သတ်မှတ်ပေးပါ။",
  BUDGET_STATUS_HEADER:
    "📊 **သင်၏ လစဉ် အသုံးစရိတ် အခြေအနေ**\n---------------------------------",
  BUDGET_STATUS_BUDGET: "💰 သတ်မှတ်ထားသော အသုံးစရိတ်  : {amount}",
  BUDGET_STATUS_USED: "📉 အသုံးပြုပြီးသမျှ : {amount} ({percent}%)",
  BUDGET_STATUS_REMAINING: "💵 ကျန်ရှိငွေ : {amount}",
  BUDGET_WARNING_80:
    "\n\n⚠️ **သတိပေးချက်:** ဒီလ Budget ရဲ့ 80% ကျော်သွားပါပြီ။ သတိထားသုံးစွဲပေးပါဦး။",
  BUDGET_WARNING_100:
    "\n\n🚨 **သတိပေးချက်:** ဒီလအတွက် သတ်မှတ်ထားတဲ့ Budget ပြည့်/ကျော်သွားပါပြီ။ 📉",
  BUDGET_HEADER: "📊 **လစဉ် Budget အခြေအနေ:**",
  BUDGET_USED_LINE: "- သုံးပြီးသမျှ: {amount} / {budget} ({percent}%)",

  // Voice / Photo
  VOICE_SAVED: "✅ အသံဖြင့် စာရင်းသွင်းပြီးပါပြီ။",
  VOICE_NO_RESULTS:
    "🎤 အသံထဲတွင် ငွေစာရင်း မတွေ့ပါ။ ငွေပမာဏနှင့် အကြောင်းအရာ ပါဝင်အောင် ပြောပြပေးပါဗျ။",
  VOICE_FETCH_ERROR: "⚠️ အသံဖိုင် ရယူ၍ မရပါ။ ထပ်မံကြိုးစားပါ။",
  VOICE_PROCESS_ERROR:
    "⚠️ အသံဖိုင် စီမံခြင်းတွင် အမှားရှိနေပါသည်။ ထပ်မံကြိုးစားပါ။",
  VOICE_DEFAULT_DESC: "အသံဖြင့်မှတ်ထားသည်",

  PHOTO_SAVED: "✅ ဓာတ်ပုံဖြင့် စာရင်းသွင်းပြီးပါပြီ။",
  PHOTO_NO_RESULTS:
    "🧾 ဓာတ်ပုံထဲတွင် ငွေစာရင်း မတွေ့ပါ။ ဘေလ်သို့မဟုတ် ပြေစာပုံ ဖြစ်အောင် ပြန်လည်ရိုက်ကူးပေးပါဗျ။",
  PHOTO_FETCH_ERROR: "⚠️ ဓာတ်ပုံ ရယူ၍ မရပါ။ ထပ်မံကြိုးစားပါ။",
  PHOTO_PROCESS_ERROR:
    "⚠️ ဓာတ်ပုံ စီမံခြင်းတွင် အမှားရှိနေပါသည်။ ထပ်မံကြိုးစားပါ။",
  PHOTO_DEFAULT_DESC: "ဓာတ်ပုံဖြင့်မှတ်ထားသည်",

  // AI
  AI_QUOTA_EXCEEDED:
    "တောင်းပန်ပါတယ်ဗျာ၊ ဒီနေ့အတွက် AI မေးခွန်းမေးမြန်းနိုင်သည့် အကြိမ်အရေအတွက် (၁၀ကြိမ်) ပြည့်သွားပါပြီ။ မနက်ဖြန်တွင် ပြန်လည် မေးမြန်းနိုင်ပါတယ်ဗျာ။ ခုလောလောဆယ် manual keyboard button တွေနဲ့ပဲ အလုပ်လုပ်နိုင်ပါတယ် ခင်ဗျာ...",
  AI_NOT_FINANCE:
    "ကျွန်တော်က အသုံးစရိတ်နဲ့ ပိုက်ဆံစာရင်းနဲ့ ဆိုင်တဲ့ မေးခွန်းတွေကိုပဲ ဖြေကြားပေးနိုင်ပါတယ်ဗျာ။ 📊",
  AI_NO_RESULTS: "ရှာဖွေမှုနဲ့ ကိုက်ညီတဲ့ စာရင်း မတွေ့ရှိပါဘူးဗျာ။",
  AI_ERROR:
    "⚠️ လက်ရှိတွင် AI စနစ် ခေတ္တ မအားလပ်သေးပါ (Rate Limit ပြည့်နေပါသည်)။ ခဏစောင့်၍ ထပ်မံစမ်းသပ်ပေးပါဗျာ။",

  // Help pattern (fallback)
  HELP_PATTERN:
    '💡 **Bot ကို အလွယ်တကူ သုံးစွဲနည်း**\n\n၁။ **AI ဖြင့် စာရင်းမှတ်ရန်:**\n   အလွယ်တကူ စာရိုက်လိုက်ပါ (ဥပမာ - "မနက်စာ ၄၅၀၀" သို့မဟုတ် "ကားဂိတ် ၅၀၀၀ ရေဖိုး ၁၀၀၀")\n\n၂။ **AI ဖြင့် စာရင်းပြန်မေးရန်:**\n   "ဒီလ အစားအသောက် ဘယ်လောက် ကုန်လဲ" သို့မဟုတ် "မနေ့က စာရင်းပြပါ"\n\n၃။ **Manual Step-by-Step မှတ်ရန်:**\n   ငွေပမာဏ သီးသန့် (ဥပမာ - "၁၀၀၀") ရိုက်ထည့်လိုက်ပါ။',

  // Not a transaction
  NOT_A_TRANSACTION:
    "🤖 ကျွန်တော်က အသုံးစရိတ် စာရင်းမှတ်ပေးတဲ့ Bot ပါဗျ။ 📊 စာရင်းမှတ်ချင်ရင် 'မနက်စာ ၄၅၀၀' လို့ ရိုက်ပါ သို့မဟုတ် စာရင်းမေးချင်ရင် 'ဒီလ အစားအသောက် ဘယ်လောက် ကုန်လဲ' လို့ မေးနိုင်ပါတယ်ဗျ။",

  // AI Rate Limit (bot.ts)
  AI_RATE_LIMIT:
    "⚠️ AI Rate Limit ပြည့်နေပါသည်။ ခဏစောင့်၍ ထပ်မံစမ်းသပ်ပေးပါဗျာ။",

  // Language
  LANGUAGE_PROMPT: "🌍 ဘာသာစကား ရွေးပါ:",
  LANGUAGE_CHANGED_EN: "✅ ဘာသာစကားကို English သို့ ပြောင်းလဲပြီးပါပြီ။",
  LANGUAGE_CHANGED_MM: "✅ ဘာသာစကားကို မြန်မာဘာသာသို့ ပြောင်းလဲပြီးပါပြီ။",

  // Cron Reminder
  CRON_REMINDER:
    "💸 **ဒီနေ့ ပိုက်ဆံတွေ ဘယ်ပျောက်ကုန်ပြီလဲ?**\n\nအိတ်ကပ်ထဲက ပိုက်ဆံ မထွက်ခင်/ထွက်ပြီးတာလေးတွေ စာရင်းမှတ်ထားလိုက်ဦးနော် 😉\n\n*(စာတိုရိုက်ပြီး တန်းပို့လိုက်ရုံပါပဲ)*",

  // Menu
  MENU_BALANCE: "💰 လက်ကျန်ငွေ",
  MENU_TODAY: "📅 ယနေ့စာရင်း",
  MENU_MONTHLY: "📅 ယခုလ",
  MENU_PREVIOUS_MONTH: "📅 ပြီးခဲ့သည့်လ",
  MENU_YEARLY: "📆 ယခုနှစ်",
  MENU_SET_BUDGET: "⚙️ ဘတ်ဂျက်သတ်မှတ်",
  MENU_CHECK_BUDGET: "📊 ဘတ်ဂျက်အခြေအနေ",

  // Mini App / Dashboard
  GREETING_MORNING: "မင်္ဂလာနံနက်ခင်းပါ",
  GREETING_AFTERNOON: "မင်္ဂလာနေ့လယ်ပါ",
  GREETING_EVENING: "မင်္ဂလာညနေခင်းပါ",
  NET_BALANCE: "လက်ကျန်ငွေ",
  CARRIED_FORWARD: "*(ယခင်လမှ ကျန်ငွေ: +{amount} Ks)*",
  TOTAL_INCOME: "စုစုပေါင်း ဝင်ငွေ",
  TOTAL_EXPENSE: "စုစုပေါင်း ထွက်ငွေ",
  HISTORY: "မှတ်တမ်း",
  ANALYTICS: "ခွဲခြမ်းစိတ်ဖြာချက်",
  NO_TRANSACTIONS: "စာရင်း မရှိသေးပါ",
  LOADING: "ဖွင့်နေပါသည်...",
  ADD_TRANSACTION: "စာရင်း ထည့်ရန်",
  EDIT_TRANSACTION: "စာရင်း ပြင်ရန်",
  DELETE: "ဖျက်ရန်",
  SAVE: "သိမ်းဆည်းရန်",
  CANCEL: "ပယ်ဖျက်ရန်",
  AMOUNT: "ပမာဏ",
  CATEGORY: "အမျိုးအစား",
  TYPE: "အမျိုးအစား",
  DESCRIPTION: "ဖော်ပြချက်",
  INCOME: "ဝင်ငွေ",
  EXPENSE: "ထွက်ငွေ",
  BUDGET: "ဘတ်ဂျက်",
  REMAINING: "ကျန်ရှိ",
  USED: "သုံးပြီး",
  MONTH: "လ",
  YEAR: "နှစ်",
  TRANSACTIONS: "စာရင်းများ",
  TOTAL: "စုစုပေါင်း",
  ERROR_GENERIC: "❌ အမှားတစ်ခု ဖြစ်ပေါ်နေပါသည်။ ထပ်ကြိုးစားပေးပါ။",
  BUDGET_EXCEEDED: "🚨 ဘတ်ဂျက် ကျော်လွန်ပါပြီ!",
  YESTERDAY: "မနေ့က",
  ITEMS_COUNT: "စာရင်း {count} ခု",
  ALL: "အားလုံး",
  SEARCH_PLACEHOLDER: "စာရင်းများ ရှာဖွေပါ...",
  SELECT_CATEGORY: "ကဏ္ဍ ရွေးပါ",
  BUDGET_LABEL: "ဘတ်ဂျက်",
  SPENT_LABEL: "သုံးပြီး:",
  CURRENCY: "Ks",

  // Categories - Income
  CAT_SALARY: "လစာ",
  CAT_BUSINESS: "စီးပွားရေး",
  CAT_FREELANCE: "Freelance",
  CAT_GIFT: "လက်ဆောင်",
  CAT_INVESTMENT: "ရင်းနှီးမြှုပ်နှံမှု",
  CAT_OTHER: "အခြား",

  // Categories - Expense
  CAT_FOOD: "အစားအသောက်",
  CAT_TRANSPORT: "သွားလာရေး",
  CAT_RENT: "အိမ်ငှားခ",
  CAT_UTILITIES: "မီး/ရေ/အင်တာနက်",
  CAT_HEALTH: "ကျန်းမာရေး",
  CAT_SHOPPING: "ဈေးဝယ်ခြင်း",
  CAT_EDUCATION: "ပညာရေး",
  CAT_ENTERTAINMENT: "ဖျော်ဖြေရေး",
  CAT_FAMILY: "မိသားစု",

  // Month names (short)
  MONTH_JAN: "ဇန်",
  MONTH_FEB: "ဖေ",
  MONTH_MAR: "မတ်",
  MONTH_APR: "ဧပြီ",
  MONTH_MAY: "မေ",
  MONTH_JUN: "ဇွန်",
  MONTH_JUL: "ဇူလိုင်",
  MONTH_AUG: "ဩ",
  MONTH_SEP: "စက်တင်ဘာ",
  MONTH_OCT: "အောက်တိုဘာ",
  MONTH_NOV: "နိုဝင်ဘာ",
  MONTH_DEC: "ဒီဇင်ဘာ",

  // Month names (full)
  MONTH_FULL_JAN: "ဇန်နဝါရီ",
  MONTH_FULL_FEB: "ဖေဖော်ဝါရီ",
  MONTH_FULL_MAR: "မတ်",
  MONTH_FULL_APR: "ဧပြီ",
  MONTH_FULL_MAY: "မေ",
  MONTH_FULL_JUN: "ဇွန်",
  MONTH_FULL_JUL: "ဇူလိုင်",
  MONTH_FULL_AUG: "ဩဂုတ်",
  MONTH_FULL_SEP: "စက်တင်ဘာ",
  MONTH_FULL_OCT: "အောက်တိုဘာ",
  MONTH_FULL_NOV: "နိုဝင်ဘာ",
  MONTH_FULL_DEC: "ဒီဇင်ဘာ",

  // Delete confirmation
  DELETE_CONFIRM_TITLE: "ဖျက်မလား?",
  DELETE_CONFIRM_MESSAGE: "ဒီစာရင်းက ဖျက်ပြီးသား ဖြစ်နေပါသည် (သို့မဟုတ် မရှိတော့ပါ)",
} as const;

export type TranslationKey = keyof typeof mm;
