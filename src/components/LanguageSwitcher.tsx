import { useTranslation, SUPPORTED_LANGS, LANG_LABELS } from '../i18n';
import type { Lang } from '../i18n';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="flex items-center gap-1.5 bg-[#151619] rounded-full px-3 py-1.5 border border-white/10">
      <Globe size={14} className="text-white/50" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="bg-transparent text-xs text-white/80 outline-none cursor-pointer appearance-none pr-1"
      >
        {SUPPORTED_LANGS.map((l) => (
          <option key={l} value={l} className="bg-[#151619] text-white">
            {LANG_LABELS[l]}
          </option>
        ))}
      </select>
    </div>
  );
}
