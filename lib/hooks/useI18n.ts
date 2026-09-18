"use client";

import { useCallback, useMemo } from "react";
import { en } from "@/lib/i18n/locales/en";
import { mm } from "@/lib/i18n/locales/mm";

type Locale = "en" | "mm";

type TranslationKey = keyof typeof en;

const locales = { en, mm } as const;

const getBrowserLanguage = (): Locale => {
  if (typeof window === "undefined") return "mm";
  const stored = localStorage.getItem("userLanguage") as Locale | null;
  if (stored && (stored === "en" || stored === "mm")) return stored;
  return "mm";
};

export const useI18n = () => {
  const lang = useMemo(() => getBrowserLanguage(), []);

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
