import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import en from './en.json';
import ar from './ar.json';

export type Locale = 'en' | 'ar';
type Dir = 'ltr' | 'rtl';

interface LanguageContextType {
  locale: Locale;
  dir: Dir;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
}

const translations: Record<Locale, Record<string, unknown>> = { en, ar };

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') return path;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : path;
}

const LOCALE_KEY = 'nc-locale';

function getInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored === 'ar' || stored === 'en') return stored;
  } catch {}
  return 'en';
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const dir: Dir = locale === 'ar' ? 'rtl' : 'ltr';

  const t = useCallback(
    (key: string) => getNestedValue(translations[locale] as Record<string, unknown>, key),
    [locale]
  );

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(LOCALE_KEY, newLocale);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale, dir]);

  return (
    <LanguageContext.Provider value={{ locale, dir, t, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
