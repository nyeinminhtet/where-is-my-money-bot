function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  // Prisma / Database
  databaseUrl: getEnvVar("DATABASE_URL"),
  directUrl: getEnvVar("DIRECT_URL"),

  // Telegram
  telegramBotToken: getEnvVar("TELEGRAM_BOT_TOKEN"),
  telegramApiUrl: getEnvVar("TELEGRAM_API_URL", "https://api.telegram.org"),

  // Gemini AI
  gemini: {
    apiKey: getEnvVar("GEMINI_API_KEY"),
    model: getEnvVar("GEMINI_MODEL", "gemini-3.5-flash"),
    proxyUrl:
      process.env.GEMINI_PROXY_URL ||
      "https://muddy-sun-be07.nyeinmg904.workers.dev",
  },
} as const;
