"use client";

import { useCallback, useEffect, useState } from "react";
import { en } from "@/lib/i18n/locales/en";
import { mm } from "@/lib/i18n/locales/mm";
import { getTelegramUserLanguage } from "@/lib/telegram-webapp";

type Locale = "en" | "mm";

type TranslationKey = keyof typeof en;

const locales = { en, mm } as const;

const getInitialLanguage = (): Locale => {
  if (typeof window === "undefined") return "mm";

  const stored = localStorage.getItem("userLanguage") as Locale | null;
  if (stored && (stored === "en" || stored === "mm")) return stored;

  const telegramLang = getTelegramUserLanguage();
  if (telegramLang) {
    const normalized = telegramLang.toLowerCase().startsWith("en") ? "en" : "mm";
    localStorage.setItem("userLanguage", normalized);
    return normalized;
  }

  return "mm";
};

export const useI18n = () => {
  const [lang, setLang] = useState<Locale>(getInitialLanguage);

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const initData = window.Telegram?.WebApp?.initData;
        if (!initData) return;

        const res = await fetch("/api/user/settings", {
          headers: {
            Authorization: "Bearer " + initData,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        const serverLang = data.language as Locale;

        if (serverLang && (serverLang === "en" || serverLang === "mm")) {
          localStorage.setItem("userLanguage", serverLang);
          setLang(serverLang);
        }
      } catch {
        // Silently fall back to localStorage value
      }
    };

    fetchLanguage();
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      const dict = locales[lang] || locales.mm;
      const baseText: string = dict[key] ?? locales.mm[key] ?? key;

      if (!params) return baseText;

      return Object.entries(params).reduce<string>(
        (text, [paramKey, value]) =>
          text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(value)),
        baseText,
      );
    },
    [lang],
  );

  const setLanguage = useCallback((newLang: Locale) => {
    localStorage.setItem("userLanguage", newLang);
    window.location.reload();
  }, []);

  return { lang, t, setLanguage };
};
