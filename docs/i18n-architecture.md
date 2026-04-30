# Architettura i18n per TeckTune

> **Progetto:** TeckTune — SPA React 19 + Vite + TypeScript + TailwindCSS  
> **Scope:** ~130 stringhe UI, 10 lingue, nessun routing.  
> **Vincolo:** soluzione custom leggera basata su React Context, type-safe, lazy-loading da `public/locales/`, persistenza `localStorage`, rilevamento lingua browser al primo accesso.

---

## 1. Approccio Scelto e Motivazioni

### Perché una soluzione custom invece di react-i18next / Lingui / FormatJS

| Criterio | Valutazione |
|----------|-------------|
| **Dimensione bundle** | TeckTune è una SPA senza routing con ~130 stringhe. Aggiungere `react-i18next` + `i18next` (~15 kB gz) + `i18next-http-backend` è sproporzionato rispetto al guadagno. |
| **Controllo totale** | Abbiamo bisogno di logica custom per i termini musicali (note, intervalli) che **non devono mai essere tradotti**. Una soluzione interna permette di integrare questo filtro nativamente senza plugin o namespace separati. |
| **Type-safety** | Un sistema custom con chiavi gerarchiche statiche offre autocomplete immediato in TypeScript senza dipendenze aggiuntive come `i18next-typescript-plugin`. |
| **Lazy-loading nativo** | Vite supporta `import()` dinamico su JSON in `public/`. Possiamo caricare solo il file della lingua attiva senza librerie di backend. |
| **Persistenza & rilevamento** | `localStorage` e `navigator.language` sono API browser banali; non serve una libreria per gestirle. |

**Decisione:** implementare un provider React Context + hook `useTranslation()` custom di ~80-100 righe, con un loader asincrono per i file JSON in `public/locales/{lang}/common.json`.

---

## 2. Struttura File Traduzioni

```
public/
└── locales/
    ├── it/                 # italiano (default, fallback)
    │   └── common.json
    ├── en/
    │   └── common.json
    ├── ru/
    │   └── common.json
    ├── fr/
    │   └── common.json
    ├── de/
    │   └── common.json
    ├── zh/
    │   └── common.json
    ├── ro/
    │   └── common.json
    ├── el/
    │   └── common.json
    ├── es/
    │   └── common.json
    └── pt/                 # portoghese (10ª lingua)
        └── common.json
```

- **Un solo file per lingua:** dato il numero ridotto di stringhe, un unico namespace `common` è sufficiente. Se in futuro il progetto crescesse, si può splittare in `common.json`, `theory.json`, ecc.
- **Posizione in `public/`:** Vite serve questi file come asset statici; possono essere fetchati via `fetch()` e non vengono inclusi nel bundle JS.

---

## 3. Schema Chiavi Gerarchiche

Le chiavi seguono la struttura del DOM e dei componenti per garantire immediatezza di ricerca e manutenibilità.

```json
{
  "app": {
    "header": {
      "tune": "Tune :",
      "stringTitles": {
        "eLow": "6th - Low E",
        "a": "5th - A",
        "d": "4th - D",
        "g": "3rd - G",
        "b": "2nd - B",
        "eHigh": "1st - High E"
      },
      "intervals": "Intervals",
      "notes": "Notes"
    },
    "scaleCard": {
      "selectedScale": "Selected Scale",
      "scaleABase": "Scale A (Base)",
      "scaleBTarget": "Scale B (Target)",
      "rootNote": "Root Note",
      "scaleType": "Scale Type",
      "listen": "Listen to Scale"
    },
    "mode": {
      "compare": "Compare",
      "active": "Active",
      "enableCompare": "Enable Compare Mode",
      "returnSingle": "Return to Single Mode"
    },
    "legend": {
      "rootA": "Root (A)",
      "inBoth": "In Both Scales",
      "soloB": "Solo in Scale B",
      "soloBNote": "Nuove note",
      "soloA": "Solo in Scale A",
      "soloANote": "Note perse",
      "rootNote": "Root Note",
      "scaleNote": "Scale Note"
    }
  },
  "theory": {
    "title": "Guida Teorica alle Scale",
    "subtitle": "Scopri come le scale vengono utilizzate nei diversi generi...",
    "tabs": {
      "styles": "Stili Musicali",
      "scales": "Scale e Canzoni",
      "improv": "Improvvisazione"
    },
    "styles": {
      "title": "Applicazione per Generi Musicali",
      "bluesRock": {
        "title": "Blues & Rock",
        "desc": "IL cuore del Blues è la Pentatonica Minore..."
      },
      "jazzFusion": {
        "title": "Jazz & Fusion",
        "desc": "Il Jazz richiede scale per assecondare progressioni armoniche complesse..."
      },
      "metalHardRock": {
        "title": "Metal & Hard Rock",
        "desc": "L'aggressività è data dai semitoni vicini alla tonica..."
      },
      "popClassical": {
        "title": "Pop & Musica Classica",
        "desc": "Pop e Classic Rock prosperano sulla Ionica (Maggiore)..."
      }
    },
    "scales": {
      "title": "Colori delle Scale e Brani Celebri",
      "referenceSongs": "Brani di Riferimento:",
      "scaleNames": {
        "majorIonian": "Ionica (Maggiore)",
        "naturalMinorAeolian": "Eolia (Minore Nat.)",
        "majorPentatonic": "Pentatonica Maggiore",
        "minorPentatonic": "Pentatonica Minore",
        "blues": "Blues",
        "mixolydian": "Misolidia",
        "dorian": "Dorica",
        "phrygian": "Frigia",
        "lydian": "Lidia",
        "locrian": "Locria",
        "harmonicMinor": "Minore Armonica",
        "melodicMinor": "Minore Melodica",
        "lydianDominant": "Lidia Dominante",
        "altered": "Super Locria (Alterata)",
        "wholeTone": "Tonale Intera",
        "halfWholeDiminished": "Semidiminuita/Diminuita",
        "bebopDominant": "Bebop Dominante"
      },
      "moods": {
        "majorIonian": "Felice, Trionfante",
        "dorian": "Minore luminoso, Bluesy, Sofisticato",
        "phrygian": "Oscuro, Spagnolo/Flamenco",
        "lydian": "Onirico, Fluttuante, Magico",
        "mixolydian": "Maggiore bluesy, Rock 'n Roll",
        "naturalMinorAeolian": "Triste, Epico, Melanconico",
        "harmonicMinor": "Neoclassico, Mediorientale",
        "locrian": "Teso, Irrisolto"
      }
    },
    "improv": {
      "title": "Tecniche di Improvvisazione e Consigli",
      "mixMajorMinor": {
        "title": "Mescolare Maggiore e Minore",
        "desc": "Una delle tecniche più iconiche del blues e del rock...",
        "proTip": "💡 Pro Tip:"
      },
      "chordScale": {
        "title": "Suonare sui \"Cambi\" (Chord-Scale)",
        "desc": "Invece di usare una sola scala per tutta la canzone..."
      },
      "passingNotes": {
        "title": "Note di Passaggio (Cromatismo)",
        "desc": "Le scale contengono le note \"giuste\", ma sono i passaggi tra di esse..."
      }
    }
  },
  "instruments": {
    "acoustic": "Acoustic Guitar",
    "electric": "Electric Muted",
    "bass": "Synth Bass",
    "synthLead": "Synth Lead",
    "epiano": "Electric Piano",
    "8bit": "8-Bit Retro",
    "flute": "Flute",
    "pad": "Soft Pad",
    "organ": "Organ",
    "bell": "Crystal Bell"
  },
  "genres": {
    "pop": "Pop",
    "classical": "Classical",
    "country": "Country",
    "rock": "Rock",
    "metal": "Metal",
    "blues": "Blues",
    "jazz": "Jazz",
    "funk": "Funk",
    "fusion": "Fusion",
    "flamenco": "Flamenco",
    "cinematic": "Cinematic",
    "prog": "Prog"
  }
}
```

---

## 4. Design `useTranslation()` e Provider

### 4.1 Tipi

```typescript
// src/i18n/types.ts
export type Lang = 'it' | 'en' | 'ru' | 'fr' | 'de' | 'zh' | 'ro' | 'el' | 'es' | 'pt';

export const DEFAULT_LANG: Lang = 'it';
export const SUPPORTED_LANGS: Lang[] = [
  'it', 'en', 'ru', 'fr', 'de', 'zh', 'ro', 'el', 'es', 'pt'
];

export type TranslationKey =
  | `app.header.${'tune' | 'intervals' | 'notes'}`
  | `app.header.stringTitles.${'eLow' | 'a' | 'd' | 'g' | 'b' | 'eHigh'}`
  | `app.scaleCard.${'selectedScale' | 'scaleABase' | 'scaleBTarget' | 'rootNote' | 'scaleType' | 'listen'}`
  | `app.mode.${'compare' | 'active' | 'enableCompare' | 'returnSingle'}`
  | `app.legend.${'rootA' | 'inBoth' | 'soloB' | 'soloBNote' | 'soloA' | 'soloANote' | 'rootNote' | 'scaleNote'}`
  | `theory.${'title' | 'subtitle'}`
  | `theory.tabs.${'styles' | 'scales' | 'improv'}`
  | `theory.styles.${'title' | 'bluesRock.title' | 'bluesRock.desc' | 'jazzFusion.title' | 'jazzFusion.desc' | 'metalHardRock.title' | 'metalHardRock.desc' | 'popClassical.title' | 'popClassical.desc'}`
  | `theory.scales.${'title' | 'referenceSongs'}`
  | `theory.scales.scaleNames.${string}`
  | `theory.scales.moods.${string}`
  | `theory.improv.${'title' | 'mixMajorMinor.title' | 'mixMajorMinor.desc' | 'mixMajorMinor.proTip' | 'chordScale.title' | 'chordScale.desc' | 'passingNotes.title' | 'passingNotes.desc'}`
  | `instruments.${string}`
  | `genres.${string}`;

export type Translations = Record<string, unknown>;
```

> **Nota:** il tipo `TranslationKey` può essere generato automaticamente da uno script di build (opzionale) oppure mantenuto manualmente dato il numero limitato di chiavi.

### 4.2 Provider

```typescript
// src/i18n/I18nProvider.tsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Lang, Translations } from './types';
import { DEFAULT_LANG, SUPPORTED_LANGS } from './types';

const STORAGE_KEY = 'tecktune-lang';

function detectBrowserLang(): Lang {
  const raw = navigator.language || (navigator as any).userLanguage;
  const code = raw?.split('-')[0]?.toLowerCase() as Lang;
  return SUPPORTED_LANGS.includes(code) ? code : DEFAULT_LANG;
}

function getInitialLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  const detected = detectBrowserLang();
  localStorage.setItem(STORAGE_KEY, detected);
  return detected;
}

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  isReady: boolean;
}

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);
  const [dict, setDict] = useState<Translations>({});
  const [isReady, setIsReady] = useState(false);

  const load = useCallback(async (l: Lang) => {
    setIsReady(false);
    const res = await fetch(`/locales/${l}/common.json`);
    if (!res.ok) throw new Error(`Failed to load translations for ${l}`);
    const data: Translations = await res.json();
    setDict(data);
    setIsReady(true);
  }, []);

  useEffect(() => {
    load(lang);
  }, [lang, load]);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const parts = key.split('.');
      let val: unknown = dict;
      for (const p of parts) {
        if (val && typeof val === 'object' && p in val) {
          val = (val as Record<string, unknown>)[p];
        } else {
          return key; // fallback: mostra la chiave
        }
      }
      return typeof val === 'string' ? val : key;
    },
    [dict]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isReady }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
```

### 4.3 Hook `useTranslation()`

```typescript
// src/i18n/useTranslation.ts
import { useI18n } from './I18nProvider';
import type { TranslationKey } from './types';

export function useTranslation() {
  const { t, lang, setLang, isReady } = useI18n();

  function translate(key: TranslationKey, vars?: Record<string, string | number>): string {
    let raw = t(key);
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        raw = raw.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
      });
    }
    return raw;
  }

  return { t: translate, lang, setLang, isReady };
}
```

### 4.4 Bootstrap in `main.tsx`

```typescript
// src/main.tsx (modifica)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from './i18n/I18nProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
```

---

## 5. `LanguageSwitcher`

Componente minimale da posizionare nell'header di [`App.tsx`](src/App.tsx:92).

```tsx
// src/components/LanguageSwitcher.tsx
import { useTranslation } from '../i18n/useTranslation';
import { SUPPORTED_LANGS, type Lang } from '../i18n/types';
import { Globe } from 'lucide-react';

const LANG_LABELS: Record<Lang, string> = {
  it: 'IT',
  en: 'EN',
  ru: 'RU',
  fr: 'FR',
  de: 'DE',
  zh: 'ZH',
  ro: 'RO',
  el: 'EL',
  es: 'ES',
  pt: 'PT',
};

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="flex items-center gap-1 bg-[#151619] rounded-full px-3 py-1.5 border border-white/5">
      <Globe size={14} className="text-white/50 mr-1" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="bg-transparent text-xs text-white outline-none cursor-pointer appearance-none"
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
```

**Styling:** riutilizza le classi Tailwind già presenti nel progetto (bordi arrotondati, palette scura, font mono). Non richiede CSS aggiuntivo.

---

## 6. Strategia Termini Musicali

### 6.1 Cosa NON tradurre (universali)

| Entità | Esempio | Motivazione |
|--------|---------|-------------|
| Note | `C`, `C#`, `D`, `D#`, `E`, `F`, `F#`, `G`, `G#`, `A`, `A#`, `B` | Notazione anglosassone standard in tutto il mondo musicale. |
| Intervalli | `R`, `b2`, `2`, `b3`, `3`, `4`, `b5`, `5`, `b6`, `6`, `b7`, `7` | Simboli teorici internazionali. |
| Frequenze | `82.4069`, `110.0000` | Valori numerici. |
| Label corde | `E`, `A`, `D`, `G`, `B`, `E` | Identificativi fisici dello strumento. |

Questi valori rimangono hard-coded in [`src/lib/music.ts`](src/lib/music.ts:1) e [`src/lib/audio.ts`](src/lib/audio.ts:1) e non sono presenti nei file di traduzione.

### 6.2 Cosa SÌ tradurre

| Entità | Esempio | File sorgente |
|--------|---------|---------------|
| Nomi scale | `"Major (Ionian)"` → `"Ionica (Maggiore)"` | [`src/lib/music.ts`](src/lib/music.ts:18) |
| Generi musicali | `"Pop"`, `"Classical"`, `"Metal"` | [`src/lib/music.ts`](src/lib/music.ts:19) |
| Nomi strumenti audio | `"Acoustic Guitar"`, `"Electric Piano"` | [`src/lib/audio.ts`](src/lib/audio.ts:13) |
| Mood / descrizioni scale | `"Felice, Trionfante"` | [`src/components/TheorySection.tsx`](src/components/TheorySection.tsx:118) |
| Tutta la UI | header, label, legend, teoria | [`src/App.tsx`](src/App.tsx:1), [`src/components/TheorySection.tsx`](src/components/TheorySection.tsx:1) |

### 6.3 Helper per scale e generi

Poiché [`SCALES`](src/lib/music.ts:18) è un array statico con `name` e `styles` in inglese, si crea un mapping di traduzione nel provider o in un hook dedicato:

```typescript
// src/i18n/musicTerms.ts
import { SCALES } from '../lib/music';
import { useTranslation } from './useTranslation';

const SCALE_KEY_MAP: Record<string, string> = {
  'Major (Ionian)': 'theory.scales.scaleNames.majorIonian',
  'Natural Minor (Aeolian)': 'theory.scales.scaleNames.naturalMinorAeolian',
  'Major Pentatonic': 'theory.scales.scaleNames.majorPentatonic',
  'Minor Pentatonic': 'theory.scales.scaleNames.minorPentatonic',
  'Blues': 'theory.scales.scaleNames.blues',
  'Mixolydian': 'theory.scales.scaleNames.mixolydian',
  'Dorian': 'theory.scales.scaleNames.dorian',
  'Phrygian': 'theory.scales.scaleNames.phrygian',
  'Lydian': 'theory.scales.scaleNames.lydian',
  'Locrian': 'theory.scales.scaleNames.locrian',
  'Harmonic Minor': 'theory.scales.scaleNames.harmonicMinor',
  'Melodic Minor': 'theory.scales.scaleNames.melodicMinor',
  'Lydian Dominant': 'theory.scales.scaleNames.lydianDominant',
  'Altered (Super Locrian)': 'theory.scales.scaleNames.altered',
  'Whole Tone': 'theory.scales.scaleNames.wholeTone',
  'Half-Whole Diminished': 'theory.scales.scaleNames.halfWholeDiminished',
  'Bebop Dominant': 'theory.scales.scaleNames.bebopDominant',
};

export function useTranslatedScaleName(englishName: string): string {
  const { t } = useTranslation();
  const key = SCALE_KEY_MAP[englishName];
  return key ? t(key as any) : englishName;
}

export function useTranslatedGenre(englishGenre: string): string {
  const { t } = useTranslation();
  const key = `genres.${englishGenre.toLowerCase()}`;
  const translated = t(key as any);
  return translated !== key ? translated : englishGenre;
}
```

Nel componente [`Fretboard`](src/components/Fretboard.tsx) o dove si renderizzano i tag stile, si sostituisce `{style}` con `{useTranslatedGenre(style)}`.

---

## 7. Lista Completa delle Chiavi con Mappatura Sorgente

### 7.1 [`src/App.tsx`](src/App.tsx)

| Linea | Stringa originale | Chiave i18n |
|-------|-------------------|-------------|
| 112 | `Tune :` | `app.header.tune` |
| 114 | `6th - Low E` | `app.header.stringTitles.eLow` |
| 115 | `5th - A` | `app.header.stringTitles.a` |
| 116 | `4th - D` | `app.header.stringTitles.d` |
| 117 | `3rd - G` | `app.header.stringTitles.g` |
| 118 | `2nd - B` | `app.header.stringTitles.b` |
| 119 | `1st - High E` | `app.header.stringTitles.eHigh` |
| 137 | `Intervals` | `app.header.intervals` |
| 143 | `Notes` | `app.header.notes` |
| 158 | `Selected Scale` | `app.scaleCard.selectedScale` |
| 158 | `Scale A (Base)` | `app.scaleCard.scaleABase` |
| 174 | `Listen to Scale 1` | `app.scaleCard.listen` |
| 186 | `Root Note` | `app.scaleCard.rootNote` |
| 198 | `Scale Type` | `app.scaleCard.scaleType` |
| 224 | `Enable Compare Mode` | `app.mode.enableCompare` |
| 224 | `Return to Single Mode` | `app.mode.returnSingle` |
| 229 | `Compare` | `app.mode.compare` |
| 229 | `Active` | `app.mode.active` |
| 237 | `Scale B (Target)` | `app.scaleCard.scaleBTarget` |
| 253 | `Listen to Scale 2` | `app.scaleCard.listen` |
| 264 | `Root Note` | `app.scaleCard.rootNote` |
| 277 | `Scale Type` | `app.scaleCard.scaleType` |
| 306 | `Root (A)` | `app.legend.rootA` |
| 310 | `In Both Scales` | `app.legend.inBoth` |
| 314 | `Solo in Scale B` | `app.legend.soloB` |
| 314 | `Nuove note` | `app.legend.soloBNote` |
| 318 | `Solo in Scale A` | `app.legend.soloA` |
| 318 | `Note perse` | `app.legend.soloANote` |
| 325 | `Root Note` | `app.legend.rootNote` |
| 329 | `Scale Note` | `app.legend.scaleNote` |

### 7.2 [`src/components/TheorySection.tsx`](src/components/TheorySection.tsx)

| Linea | Stringa originale | Chiave i18n |
|-------|-------------------|-------------|
| 13 | `Guida Teorica alle Scale` | `theory.title` |
| 14-16 | `Scopri come le scale...` | `theory.subtitle` |
| 31 | `Stili Musicali` | `theory.tabs.styles` |
| 43 | `Scale e Canzoni` | `theory.tabs.scales` |
| 55 | `Improvvisazione` | `theory.tabs.improv` |
| 64 | `Applicazione per Generi Musicali` | `theory.styles.title` |
| 69 | `Blues & Rock` | `theory.styles.bluesRock.title` |
| 71-73 | descrizione Blues & Rock | `theory.styles.bluesRock.desc` |
| 78 | `Jazz & Fusion` | `theory.styles.jazzFusion.title` |
| 80-82 | descrizione Jazz & Fusion | `theory.styles.jazzFusion.desc` |
| 87 | `Metal & Hard Rock` | `theory.styles.metalHardRock.title` |
| 89-91 | descrizione Metal & Hard Rock | `theory.styles.metalHardRock.desc` |
| 96 | `Pop & Musica Classica` | `theory.styles.popClassical.title` |
| 98-100 | descrizione Pop & Classica | `theory.styles.popClassical.desc` |
| 111 | `Colori delle Scale e Brani Celebri` | `theory.scales.title` |
| 117 | `Ionica (Maggiore)` | `theory.scales.scaleNames.majorIonian` |
| 118 | `Felice, Trionfante` | `theory.scales.moods.majorIonian` |
| 122 | `Dorica` | `theory.scales.scaleNames.dorian` |
| 123 | `Minore luminoso, Bluesy, Sofisticato` | `theory.scales.moods.dorian` |
| 127 | `Frigia` | `theory.scales.scaleNames.phrygian` |
| 128 | `Oscuro, Spagnolo/Flamenco` | `theory.scales.moods.phrygian` |
| 132 | `Lidia` | `theory.scales.scaleNames.lydian` |
| 133 | `Onirico, Fluttuante, Magico` | `theory.scales.moods.lydian` |
| 137 | `Misolidia` | `theory.scales.scaleNames.mixolydian` |
| 138 | `Maggiore bluesy, Rock 'n Roll` | `theory.scales.moods.mixolydian` |
| 142 | `Eolia (Minore Nat.)` | `theory.scales.scaleNames.naturalMinorAeolian` |
| 143 | `Triste, Epico, Melanconico` | `theory.scales.moods.naturalMinorAeolian` |
| 147 | `Minore Armonica` | `theory.scales.scaleNames.harmonicMinor` |
| 148 | `Neoclassico, Mediorientale` | `theory.scales.moods.harmonicMinor` |
| 152 | `Locria` | `theory.scales.scaleNames.locrian` |
| 153 | `Teso, Irrisolto` | `theory.scales.moods.locrian` |
| 161 | `Brani di Riferimento:` | `theory.scales.referenceSongs` |
| 178 | `Tecniche di Improvvisazione e Consigli` | `theory.improv.title` |
| 184 | `Mescolare Maggiore e Minore` | `theory.improv.mixMajorMinor.title` |
| 185-192 | descrizione + Pro Tip | `theory.improv.mixMajorMinor.desc` |
| 190 | `💡 Pro Tip:` | `theory.improv.mixMajorMinor.proTip` |
| 198 | `Suonare sui "Cambi" (Chord-Scale)` | `theory.improv.chordScale.title` |
| 199-201 | descrizione Chord-Scale | `theory.improv.chordScale.desc` |
| 208 | `Note di Passaggio (Cromatismo)` | `theory.improv.passingNotes.title` |
| 210-212 | descrizione cromatismo | `theory.improv.passingNotes.desc` |

### 7.3 [`src/lib/music.ts`](src/lib/music.ts)

| Linea | Stringa originale | Chiave i18n | Nota |
|-------|-------------------|-------------|------|
| 1 | `C`, `C#`, ... `B` | — | **Non tradurre** |
| 3-16 | `R`, `b2`, `2`, ... `7` | — | **Non tradurre** |
| 19 | `Major (Ionian)` | `theory.scales.scaleNames.majorIonian` | Tradurre |
| 19 | `Pop`, `Classical`, `Country` | `genres.pop`, `genres.classical`, `genres.country` | Tradurre |
| 20 | `Natural Minor (Aeolian)` | `theory.scales.scaleNames.naturalMinorAeolian` | Tradurre |
| 20 | `Rock`, `Pop`, `Metal` | `genres.rock`, `genres.pop`, `genres.metal` | Tradurre |
| 21 | `Major Pentatonic` | `theory.scales.scaleNames.majorPentatonic` | Tradurre |
| 21 | `Blues`, `Rock`, `Country` | `genres.blues`, `genres.rock`, `genres.country` | Tradurre |
| 22 | `Minor Pentatonic` | `theory.scales.scaleNames.minorPentatonic` | Tradurre |
| 22 | `Blues`, `Rock`, `Metal` | `genres.blues`, `genres.rock`, `genres.metal` | Tradurre |
| 23 | `Blues` | `theory.scales.scaleNames.blues` | Tradurre |
| 23 | `Blues`, `Rock` | `genres.blues`, `genres.rock` | Tradurre |
| 24 | `Mixolydian` | `theory.scales.scaleNames.mixolydian` | Tradurre |
| 24 | `Blues`, `Jazz`, `Rock` | `genres.blues`, `genres.jazz`, `genres.rock` | Tradurre |
| 25 | `Dorian` | `theory.scales.scaleNames.dorian` | Tradurre |
| 25 | `Jazz`, `Funk`, `Fusion` | `genres.jazz`, `genres.funk`, `genres.fusion` | Tradurre |
| 26 | `Phrygian` | `theory.scales.scaleNames.phrygian` | Tradurre |
| 26 | `Metal`, `Flamenco` | `genres.metal`, `genres.flamenco` | Tradurre |
| 27 | `Lydian` | `theory.scales.scaleNames.lydian` | Tradurre |
| 27 | `Jazz`, `Cinematic`, `Prog` | `genres.jazz`, `genres.cinematic`, `genres.prog` | Tradurre |
| 28 | `Locrian` | `theory.scales.scaleNames.locrian` | Tradurre |
| 28 | `Jazz`, `Metal` | `genres.jazz`, `genres.metal` | Tradurre |
| 29 | `Harmonic Minor` | `theory.scales.scaleNames.harmonicMinor` | Tradurre |
| 29 | `Classical`, `Metal`, `Jazz` | `genres.classical`, `genres.metal`, `genres.jazz` | Tradurre |
| 30 | `Melodic Minor` | `theory.scales.scaleNames.melodicMinor` | Tradurre |
| 30 | `Jazz`, `Classical` | `genres.jazz`, `genres.classical` | Tradurre |
| 33 | `Lydian Dominant` | `theory.scales.scaleNames.lydianDominant` | Tradurre |
| 33 | `Jazz`, `Fusion` | `genres.jazz`, `genres.fusion` | Tradurre |
| 34 | `Altered (Super Locrian)` | `theory.scales.scaleNames.altered` | Tradurre |
| 34 | `Jazz` | `genres.jazz` | Tradurre |
| 35 | `Whole Tone` | `theory.scales.scaleNames.wholeTone` | Tradurre |
| 35 | `Jazz`, `Cinematic` | `genres.jazz`, `genres.cinematic` | Tradurre |
| 36 | `Half-Whole Diminished` | `theory.scales.scaleNames.halfWholeDiminished` | Tradurre |
| 36 | `Jazz`, `Metal` | `genres.jazz`, `genres.metal` | Tradurre |
| 37 | `Bebop Dominant` | `theory.scales.scaleNames.bebopDominant` | Tradurre |
| 37 | `Jazz` | `genres.jazz` | Tradurre |

### 7.4 [`src/lib/audio.ts`](src/lib/audio.ts)

| Linea | Stringa originale | Chiave i18n | Nota |
|-------|-------------------|-------------|------|
| 14 | `Acoustic Guitar` | `instruments.acoustic` | Tradurre |
| 15 | `Electric Muted` | `instruments.electric` | Tradurre |
| 16 | `Synth Bass` | `instruments.bass` | Tradurre |
| 17 | `Synth Lead` | `instruments.synthLead` | Tradurre |
| 18 | `Electric Piano` | `instruments.epiano` | Tradurre |
| 19 | `8-Bit Retro` | `instruments.8bit` | Tradurre |
| 20 | `Flute` | `instruments.flute` | Tradurre |
| 21 | `Soft Pad` | `instruments.pad` | Tradurre |
| 22 | `Organ` | `instruments.organ` | Tradurre |
| 23 | `Crystal Bell` | `instruments.bell` | Tradurre |

---

## 8. Piano di Implementazione

### Fase 1 — Scaffolding (stima: 30 min)

1. Creare la cartella `src/i18n/` con i file:
   - `types.ts`
   - `I18nProvider.tsx`
   - `useTranslation.ts`
   - `musicTerms.ts`
2. Creare `public/locales/it/common.json` (copia dello schema in sezione 3).
3. Creare `public/locales/en/common.json` come prima traduzione di riferimento.

### Fase 2 — Integrazione Provider (stima: 15 min)

1. Avvolgere `<App />` con `<I18nProvider>` in [`src/main.tsx`](src/main.tsx).
2. Verificare che `localStorage` e `navigator.language` funzionino correttamente.

### Fase 3 — Sostituzione stringhe in [`src/App.tsx`](src/App.tsx) (stima: 45 min)

1. Importare `useTranslation`.
2. Sostituire tutte le stringhe hard-coded con chiamate `t('app.*')`.
3. Inserire `<LanguageSwitcher />` nell'header (linea ~99).
4. Per i `title` dei pulsanti di tuning, usare `t('app.header.stringTitles.*')`.

### Fase 4 — Sostituzione stringhe in [`src/components/TheorySection.tsx`](src/components/TheorySection.tsx) (stima: 60 min)

1. Importare `useTranslation`.
2. Sostituire titoli, sottotitoli, tab, testi descrittivi con `t('theory.*')`.
3. Per i nomi scale e i mood, usare `useTranslatedScaleName()` e le chiavi `theory.scales.*`.
4. I brani di riferimento (nomi di canzoni e artisti) rimangono invariati.

### Fase 5 — Traduzione dati musicali (stima: 30 min)

1. In [`src/lib/music.ts`](src/lib/music.ts): lasciare `SCALES` invariato come sorgente di verità tecnica (intervalli, nomi inglesi).
2. Nei componenti che renderizzano `s.name` e `s.styles`, applicare `useTranslatedScaleName()` e `useTranslatedGenre()`.
3. In [`src/lib/audio.ts`](src/lib/audio.ts): lasciare `SOUND_TYPES` invariato come sorgente tecnica (`id`), ma nel select di [`App.tsx`](src/App.tsx:166) usare `t(`instruments.${s.id}`)` per il `name` visualizzato.

### Fase 6 — Traduzioni aggiuntive (stima: 120 min)

1. Tradurre `common.json` per le 8 lingue rimanenti (`ru`, `fr`, `de`, `zh`, `ro`, `el`, `es`, `pt`).
2. Verificare che i termini musicali (scale, generi) siano corretti in ogni lingua.
3. Testare il lazy-loading: aprire DevTools → Network e confermare che solo il JSON della lingua attiva viene fetchato.

### Fase 7 — Polish & QA (stima: 30 min)

1. Aggiungere uno stato di loading (es. `isReady` nel provider) per evitare flash di testo in inglese/italiano al primo caricamento.
2. Verificare che il fallback `return key` in `t()` non esploda in produzione (opzionale: log in dev).
3. Aggiungere un test manuale per il rilevamento lingua: cambiare `Accept-Language` del browser e verificare che la lingua corretta venga selezionata al primo accesso (senza `localStorage` impostato).

---

## 9. Estensibilità Futura

- **Nuova lingua:** aggiungere il codice ISO a `SUPPORTED_LANGS`, creare `public/locales/{lang}/common.json`. Nessuna modifica al codice TypeScript.
- **Nuove stringhe:** aggiungere la chiave a tutti i file JSON e aggiornare il tipo `TranslationKey`. Se si usa uno script di generazione, il tipo si aggiorna automaticamente.
- **Pluralizzazione / interpolazione avanzata:** se necessario in futuro, estendere `translate()` con una mini-logica `Intl.PluralRules` o regex per `{{count}}`. Al momento non serve.
- **RTL (arabo, ebraico):** se mai necessario, aggiungere `dir="rtl"` al `<html>` e adattare i margini/padding in Tailwind con varianti `rtl:`.

---

*Documento redatto il 2026-04-30. Versione 1.0.*
