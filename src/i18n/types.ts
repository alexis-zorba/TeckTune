export type Lang = 'it' | 'en' | 'ru' | 'fr' | 'de' | 'zh' | 'ro' | 'el' | 'es';

export const DEFAULT_LANG: Lang = 'en';
export const SUPPORTED_LANGS: Lang[] = ['en', 'it', 'ru', 'fr', 'de', 'zh', 'ro', 'el', 'es'];

export const LANG_LABELS: Record<Lang, string> = {
  en: '🇬🇧 English',
  it: '🇮🇹 Italiano',
  ru: '🇷🇺 Русский',
  fr: '🇫🇷 Français',
  de: '🇩🇪 Deutsch',
  zh: '🇨🇳 中文',
  ro: '🇷🇴 Română',
  el: '🇬🇷 Ελληνικά',
  es: '🇪🇸 Español',
};

export type Translations = Record<string, unknown>;
