import { useI18n } from './I18nProvider';

export function useTranslation() {
  const { t, lang, setLang, isReady } = useI18n();

  function translate(key: string, vars?: Record<string, string | number>): string {
    let raw = t(key);
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        raw = raw.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), String(v));
      });
    }
    return raw;
  }

  return { t: translate, lang, setLang, isReady };
}
