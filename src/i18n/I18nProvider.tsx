import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Lang, Translations } from './types';
import { DEFAULT_LANG, SUPPORTED_LANGS } from './types';

const STORAGE_KEY = 'tecktune-lang';

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  isReady: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function detectBrowserLang(): Lang {
  try {
    const raw = navigator.language;
    if (!raw) return DEFAULT_LANG;
    const code = raw.slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS.includes(code as Lang)) {
      return code as Lang;
    }
    return DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

function getStoredLang(): Lang | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored as Lang)) {
      return stored as Lang;
    }
    return null;
  } catch {
    return null;
  }
}

function resolveValue(obj: Translations, path: string): string {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') {
      return path;
    }
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current === 'string') {
    return current;
  }
  return path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => getStoredLang() ?? detectBrowserLang());
  const [dict, setDict] = useState<Translations>({});
  const [isReady, setIsReady] = useState(false);

  const loadDict = useCallback(async (language: Lang) => {
    setIsReady(false);
    try {
      const response = await fetch(`/locales/${language}/common.json`);
      if (!response.ok) {
        throw new Error(`Failed to load locale: ${response.status}`);
      }
      const data: Translations = await response.json();
      setDict(data);
    } catch (err) {
      console.error(`[i18n] Failed to load translations for "${language}":`, err);
      // Fallback: set empty dict so t() returns keys as-is
      setDict({});
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    loadDict(lang);
  }, [lang, loadDict]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // localStorage might be unavailable (private browsing, etc.)
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return resolveValue(dict, key);
    },
    [dict],
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isReady }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
