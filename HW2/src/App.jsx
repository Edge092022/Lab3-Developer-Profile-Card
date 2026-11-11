import { useEffect, useRef, useState } from 'react';
import { PIANO_KEYS } from './music/pianoKeys.js';
import { PolyphonicSynth } from './audio/PolyphonicSynth.js';

// App tạm để test 8.1.
const WHITE_KEY_COUNT = PIANO_KEYS.filter((key) => !key.isBlack).length;
const BLACK_KEY_COUNT = PIANO_KEYS.length - WHITE_KEY_COUNT;
const FIRST_KEY = PIANO_KEYS[0];
const LAST_KEY = PIANO_KEYS[PIANO_KEYS.length - 1];

const KEY_BY_MIDI = new Map(PIANO_KEYS.map((key) => [key.midi, key]));
const C4_MIDI = 60;
// 9 nốt Đô trưởng trải 3 quãng tám: nốt thứ 9 (G5) sẽ đẩy nốt đầu (C3) ra.
const CHORD_9_MIDIS = [48, 52, 55, 60, 64, 67, 72, 76, 79];

function formatNoteNames(midis) {
  return midis.map((midi) => KEY_BY_MIDI.get(midi).noteName).join(' ');
}

function App() {
  const synthRef = useRef(null);
  const [activeMidis, setActiveMidis] = useState([]);
  const [stolenMidis, setStolenMidis] = useState([]);

  useEffect(() => {
    const synth = new PolyphonicSynth({
      onVoiceStolen: (midi) => {
        setStolenMidis((previousMidis) => [...previousMidis, midi]);
      },
    });
    synthRef.current = synth;
    return () => {
      synth.dispose();
      synthRef.current = null;
    };
  }, []);

  function playNotes(midis) {
    const synth = synthRef.current;
    if (synth === null) {
      return;
    }
    for (const midi of midis) {
      synth.noteOn(midi, KEY_BY_MIDI.get(midi).freqHz);
    }
    setActiveMidis(synth.activeMidis);
  }

  function stopAll() {
    const synth = synthRef.current;
    if (synth === null) {
      return;
    }
    synth.allNotesOff();
    setActiveMidis(synth.activeMidis);
    setStolenMidis([]);
  }

  return (
    <main>
      <h1>Midnight Concert Piano 88</h1>

      <p>
        {PIANO_KEYS.length} phím: {WHITE_KEY_COUNT} trắng, {BLACK_KEY_COUNT} đen ({FIRST_KEY.noteName}{' '}
        {FIRST_KEY.freqHz.toFixed(2)} Hz → {LAST_KEY.noteName} {LAST_KEY.freqHz.toFixed(2)} Hz)
      </p>

      <button type="button" onClick={() => playNotes([C4_MIDI])}>
        Bật C4
      </button>{' '}
      <button type="button" onClick={() => playNotes(CHORD_9_MIDIS)}>
        Bật hợp âm 9 nốt
      </button>{' '}
      <button type="button" onClick={stopAll}>
        Tắt hết
      </button>

      <p>
        <output>
          Đang kêu ({activeMidis.length}/8): {formatNoteNames(activeMidis) || '—'} · Bị đẩy ra:{' '}
          {formatNoteNames(stolenMidis) || '—'}
        </output>
      </p>
    </main>
  );
}

export default App;
