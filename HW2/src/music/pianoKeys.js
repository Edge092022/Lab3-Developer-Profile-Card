// Piano 88 phím: midi 21 (A0) đến 108 (C8).
export const FIRST_MIDI = 21;
export const LAST_MIDI = 108;

const A4_MIDI = 69;
const A4_FREQ_HZ = 440;

// Tên nốt theo pitch class (midi % 12), dùng dấu thăng ♯.
const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

// f = 440 × 2^((midi − 69) / 12)
export function midiToFreqHz(midi) {
  return A4_FREQ_HZ * 2 ** ((midi - A4_MIDI) / 12);
}

// Quy ước MIDI: midi 60 = C4, nên quãng tám = floor(midi / 12) − 1.
export function midiToNoteName(midi) {
  const pitchClass = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[pitchClass]}${octave}`;
}

export function createPianoKeys(firstMidi = FIRST_MIDI, lastMidi = LAST_MIDI) {
  return Array.from({ length: lastMidi - firstMidi + 1 }, (_, offset) => {
    const midi = firstMidi + offset;
    const noteName = midiToNoteName(midi);
    return {
      midi,
      noteName,
      // Phím đen là các nốt có dấu thăng.
      isBlack: noteName.includes('♯'),
      freqHz: midiToFreqHz(midi),
    };
  });
}

// Tạo một lần khi tải module; mọi component dùng chung mảng này.
export const PIANO_KEYS = createPianoKeys();
