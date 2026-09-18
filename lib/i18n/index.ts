import { en } from "./locales/en";
import { mm } from "./locales/mm";

const locales = { en, mm } as const;

export type Locale = keyof typeof locales;

export type TranslationKey = keyof typeof en;

const isValidLocale = (lang: string): lang is Locale => lang in locales;

export const getTranslation = (
  lang: string,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string => {
  const dict = isValidLocale(lang) ? locales[lang] : locales.mm;
  const baseText: string = dict[key] ?? locales.mm[key] ?? key;

  if (!params) return baseText;

  return Object.entries(params).reduce<string>(
    (text, [paramKey, value]) =>
      text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(value)),
    baseText,
  );
};

export { en, mm };
