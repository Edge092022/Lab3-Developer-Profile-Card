import { memo } from 'react';
import styles from './PianoKey.module.css';

function isActivationKey(event) {
  return event.code === 'Space' || event.code === 'Enter' || event.code === 'NumpadEnter';
}

// memo: chỉ render lại khi prop của chính phím này đổi (thường là isPressed).
// onNoteOn/onNoteOff từ cha phải ổn định (useCallback) thì memo mới có tác dụng.
function PianoKey({ midi, noteName, isBlack, isPressed, onNoteOn, onNoteOff }) {
  function handlePointerDown(event) {
    // Chuột: chỉ nút trái. Cảm ứng/bút: mọi lần chạm.
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }
    // Giữ pointer cho phím này để pointerup luôn về đúng phím, kể cả khi kéo ra ngoài.
    event.currentTarget.setPointerCapture(event.pointerId);
    onNoteOn(midi);
  }

  function handlePointerEnd() {
    onNoteOff(midi);
  }

  function handleKeyDown(event) {
    if (!isActivationKey(event)) {
      return;
    }
    // Chặn click mặc định của Space/Enter; nốt do keydown/keyup điều khiển.
    event.preventDefault();
    if (event.repeat) {
      return;
    }
    onNoteOn(midi);
  }

  function handleKeyUp(event) {
    if (!isActivationKey(event)) {
      return;
    }
    event.preventDefault();
    onNoteOff(midi);
  }

  const className = [
    styles.key,
    isBlack ? styles.black : styles.white,
    isPressed ? styles.pressed : '',
  ].join(' ');

  return (
    <button
      type="button"
      className={className}
      aria-pressed={isPressed}
      data-midi={midi}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <span className={styles.label}>{noteName}</span>
    </button>
  );
}

export default memo(PianoKey);
