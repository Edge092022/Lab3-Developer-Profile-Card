import { useEffect, useRef } from 'react';
import { FIRST_MIDI, LAST_MIDI } from '../music/pianoKeys.js';

// 13 phím = 13 nốt từ Đô của quãng hiện tại tới Đô quãng trên (e.code = vị trí phím vật lý).
// Hàng dưới A S D F G H J K là phím trắng, hàng trên W E T Y U là phím đen.
const SEMITONE_BY_CODE = new Map([
  ['KeyA', 0],
  ['KeyW', 1],
  ['KeyS', 2],
  ['KeyE', 3],
  ['KeyD', 4],
  ['KeyF', 5],
  ['KeyT', 6],
  ['KeyG', 7],
  ['KeyY', 8],
  ['KeyH', 9],
  ['KeyU', 10],
  ['KeyJ', 11],
  ['KeyK', 12],
]);

const OCTAVE_SHIFT_BY_CODE = new Map([
  ['KeyZ', -1],
  ['KeyX', 1],
]);

const TEXT_ENTRY_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return TEXT_ENTRY_TAGS.has(target.tagName) || target.isContentEditable;
}

// Quy ước MIDI: Đô của quãng n là (n + 1) × 12 (C4 = 60).
export function octaveToCMidi(octave) {
  return (octave + 1) * 12;
}

export function usePianoKeyboard({
  octave,
  onNoteOn,
  onNoteOff,
  onOctaveShift,
  onReleaseAll,
  isEnabled = true,
}) {
  // Phím đang giữ -> midi đã bật. Đổi quãng khi đang giữ thì keyup vẫn tắt đúng nốt cũ.
  // Để trong ref để không mất khi effect gắn lại listener (đổi quãng làm effect chạy lại).
  const heldMidiByCodeRef = useRef(new Map());

  useEffect(() => {
    if (!isEnabled) {
      return undefined;
    }
    const heldMidiByCode = heldMidiByCodeRef.current;

    function handleKeyDown(event) {
      if (event.repeat || event.isComposing) {
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      if (isTypingTarget(event.target)) {
        return;
      }

      const octaveShift = OCTAVE_SHIFT_BY_CODE.get(event.code);
      if (octaveShift !== undefined) {
        event.preventDefault();
        onOctaveShift(octaveShift);
        return;
      }

      const semitone = SEMITONE_BY_CODE.get(event.code);
      if (semitone === undefined) {
        return;
      }
      event.preventDefault();

      const midi = octaveToCMidi(octave) + semitone;
      // Nốt nằm ngoài 88 phím thì bỏ qua.
      if (midi < FIRST_MIDI || midi > LAST_MIDI) {
        return;
      }
      heldMidiByCode.set(event.code, midi);
      onNoteOn(midi);
    }

    // keyup không lọc theo target: phím nào đã bật nốt thì nhả ra phải tắt nốt đó.
    function handleKeyUp(event) {
      const midi = heldMidiByCode.get(event.code);
      if (midi === undefined) {
        return;
      }
      heldMidiByCode.delete(event.code);
      onNoteOff(midi);
    }

    // Mất focus cửa sổ hoặc ẩn tab thì trình duyệt không gửi keyup -> tắt hết để không kẹt nốt.
    function releaseAll() {
      heldMidiByCode.clear();
      onReleaseAll();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        releaseAll();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', releaseAll);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', releaseAll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [octave, onNoteOn, onNoteOff, onOctaveShift, onReleaseAll, isEnabled]);
}
