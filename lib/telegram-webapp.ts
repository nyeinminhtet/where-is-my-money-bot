declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe?: {
          user?: {
            id?: number;
            first_name?: string;
          };
        };
      };
    };
  }
}

export const getTelegramInitData = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp?.initData ?? null;
};
