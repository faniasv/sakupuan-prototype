// Central, lazily-read environment access. Import { env } instead of touching
// process.env in route handlers so every variable is documented in one place.

export const env = {
  get demoMode() {
    return process.env.DEMO_MODE === "true";
  },
  get isProd() {
    return process.env.NODE_ENV === "production";
  },
  get sessionSecret() {
    const s = process.env.SESSION_SECRET;
    if (s) return s;
    if (this.isProd) throw new Error("SESSION_SECRET is required in production");
    return "dev-only-insecure-secret";
  },
  get databaseUrl() {
    return process.env.DATABASE_URL || "";
  },
  get telegramBotToken() {
    return process.env.TELEGRAM_BOT_TOKEN || "";
  },
  get telegramWebhookSecret() {
    return process.env.TELEGRAM_WEBHOOK_SECRET || "";
  },
  get telegramBotUsername() {
    return (
      process.env.TELEGRAM_BOT_USERNAME ||
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ||
      "saku_puan_bot"
    );
  },
  get aiServiceUrl() {
    return (process.env.AI_SERVICE_URL || "").replace(/\/$/, "");
  },
  get aiServiceKey() {
    return process.env.AI_SERVICE_KEY || "";
  },
  get cronSecret() {
    return process.env.CRON_SECRET || "";
  },
};
