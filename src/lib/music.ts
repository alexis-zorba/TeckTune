export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const INTERVAL_NAMES: Record<number, string> = {
  0: "R",
  1: "b2",
  2: "2",
  3: "b3",
  4: "3",
  5: "4",
  6: "b5",
  7: "5",
  8: "b6",
  9: "6",
  10: "b7",
  11: "7",
};

export const SCALES = [
  { name: "Major (Ionian)", intervals: [0, 2, 4, 5, 7, 9, 11], styles: ["Pop", "Classical", "Country"] },
  { name: "Natural Minor (Aeolian)", intervals: [0, 2, 3, 5, 7, 8, 10], styles: ["Rock", "Pop", "Metal"] },
  { name: "Major Pentatonic", intervals: [0, 2, 4, 7, 9], styles: ["Blues", "Rock", "Country"] },
  { name: "Minor Pentatonic", intervals: [0, 3, 5, 7, 10], styles: ["Blues", "Rock", "Metal"] },
  { name: "Blues", intervals: [0, 3, 5, 6, 7, 10], styles: ["Blues", "Rock"] },
  { name: "Mixolydian", intervals: [0, 2, 4, 5, 7, 9, 10], styles: ["Blues", "Jazz", "Rock"] },
  { name: "Dorian", intervals: [0, 2, 3, 5, 7, 9, 10], styles: ["Jazz", "Funk", "Fusion"] },
  { name: "Phrygian", intervals: [0, 1, 3, 5, 7, 8, 10], styles: ["Metal", "Flamenco"] },
  { name: "Lydian", intervals: [0, 2, 4, 6, 7, 9, 11], styles: ["Jazz", "Cinematic", "Prog"] },
  { name: "Locrian", intervals: [0, 1, 3, 5, 6, 8, 10], styles: ["Jazz", "Metal"] },
  { name: "Harmonic Minor", intervals: [0, 2, 3, 5, 7, 8, 11], styles: ["Classical", "Metal", "Jazz"] },
  { name: "Melodic Minor", intervals: [0, 2, 3, 5, 7, 9, 11], styles: ["Jazz", "Classical"] },
  
  // Jazz specific scales
  { name: "Lydian Dominant", intervals: [0, 2, 4, 6, 7, 9, 10], styles: ["Jazz", "Fusion"] },
  { name: "Altered (Super Locrian)", intervals: [0, 1, 3, 4, 6, 8, 10], styles: ["Jazz"] },
  { name: "Whole Tone", intervals: [0, 2, 4, 6, 8, 10], styles: ["Jazz", "Cinematic"] },
  { name: "Half-Whole Diminished", intervals: [0, 1, 3, 4, 6, 7, 9, 10], styles: ["Jazz", "Metal"] },
  { name: "Bebop Dominant", intervals: [0, 2, 4, 5, 7, 9, 10, 11], styles: ["Jazz"] }
];

export const STRING_TUNING = [4, 11, 7, 2, 9, 4]; // E4, B3, G3, D3, A2, E2 -> High to Low string
// 0: High E, 1: B, 2: G, 3: D, 4: A, 5: Low E

export const FRETS = 22;

export function getNoteAt(stringNote: number, fret: number) {
  return (stringNote + fret) % 12;
}

export function getInterval(root: number, note: number) {
  return (note - root + 12) % 12;
}
