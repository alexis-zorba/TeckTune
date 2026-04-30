import { useTranslation } from './useTranslation';

const SCALE_KEY_MAP: Record<string, string> = {
  'Major (Ionian)': 'scales.majorIonian',
  'Natural Minor (Aeolian)': 'scales.naturalMinorAeolian',
  'Major Pentatonic': 'scales.majorPentatonic',
  'Minor Pentatonic': 'scales.minorPentatonic',
  'Blues': 'scales.blues',
  'Mixolydian': 'scales.mixolydian',
  'Dorian': 'scales.dorian',
  'Phrygian': 'scales.phrygian',
  'Lydian': 'scales.lydian',
  'Locrian': 'scales.locrian',
  'Harmonic Minor': 'scales.harmonicMinor',
  'Melodic Minor': 'scales.melodicMinor',
  'Lydian Dominant': 'scales.lydianDominant',
  'Altered (Super Locrian)': 'scales.altered',
  'Whole Tone': 'scales.wholeTone',
  'Half-Whole Diminished': 'scales.halfWholeDiminished',
  'Bebop Dominant': 'scales.bebopDominant',
};

export function useTranslatedScaleName(englishName: string): string {
  const { t } = useTranslation();
  const key = SCALE_KEY_MAP[englishName];
  return key ? t(key) : englishName;
}

export function useTranslatedGenre(englishGenre: string): string {
  const { t } = useTranslation();
  const key = `genres.${englishGenre.toLowerCase()}`;
  const translated = t(key);
  return translated !== key ? translated : englishGenre;
}
