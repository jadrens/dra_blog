"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { en, TranslationKeys } from "./en";
import { zhCN } from "./zh-CN";

export type Locale = "en" | "zh-CN";

const translations: Record<Locale, TranslationKeys> = {
  en,
  "zh-CN": zhCN,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: en,
});

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored && translations[stored]) {
      setLocale(stored);
    } else {
      const browserLang = navigator.language;
      if (browserLang.startsWith("zh")) {
        setLocale("zh-CN");
      }
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale: handleSetLocale,
        t: translations[locale],
      }}
    >
      {mounted ? children : null}
    </I18nContext.Provider>
  );
}