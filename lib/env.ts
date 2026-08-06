const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  // Prisma / Database
  databaseUrl: getEnvVar("DATABASE_URL"),
  directUrl: getEnvVar("DIRECT_URL"),

  // App url
  appUrl: getEnvVar("NEXT_PUBLIC_SITE_URL"),

  // Telegram
  telegram: {
    botToken: getEnvVar("TELEGRAM_BOT_TOKEN"),
    apiUrl: getEnvVar("TELEGRAM_API_URL", "https://api.telegram.org"),
    adminId: getEnvVar("ADMIN_TELEGRAM_ID"),
  },

  // Gemini AI
  gemini: {
    apiKey: getEnvVar("GEMINI_API_KEY"),
    model: getEnvVar("GEMINI_MODEL", "gemini-3.1-flash-lite"),
    proxyUrl:
      process.env.GEMINI_PROXY_URL ||
      "https://muddy-sun-be07.nyeinmg904.workers.dev",
  },

  // Cron
  cronSecret: getEnvVar("CRON_SECRET"),
} as const;
