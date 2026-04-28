"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import en from "./en";
import pt from "./pt";
import { LocaleStore } from "@/stores/locale";

const dictionaries = {
  pt,
  en,
} as const;

type Dictionary = typeof pt;
type TranslationKey = `${keyof Dictionary & string}.${string}`;

interface I18nContextValue {
  locale: "pt" | "en";
  setLocale: (locale: "pt" | "en") => void;
  toggleLocale: () => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const getValueByPath = (obj: unknown, path: string): string | null => {
  const value = path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return null;
  }, obj);

  return typeof value === "string" ? value : null;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = LocaleStore((s) => s.locale);
  const setLocale = LocaleStore((s) => s.setLocale);
  const toggleLocale = LocaleStore((s) => s.toggleLocale);

  const value = useMemo<I18nContextValue>(() => {
    const dictionary = dictionaries[locale];

    return {
      locale,
      setLocale,
      toggleLocale,
      t: (key) => getValueByPath(dictionary, key) ?? key,
    };
  }, [locale, setLocale, toggleLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslations() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useTranslations must be used within LanguageProvider");
  }

  return context;
}
