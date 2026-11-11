import { useEffect } from 'react';

const TEXT_ENTRY_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

// Đang gõ trong ô nhập liệu thì phím thuộc về ô đó, không kích trống.
function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return TEXT_ENTRY_TAGS.has(target.tagName) || target.isContentEditable;
}

export function useDrumKeyboard(padMap, onTriggerPad, isEnabled = true) {
  useEffect(() => {
    if (!isEnabled) {
      return undefined;
    }

    function handleKeyDown(event) {
      // Giữ phím: trình duyệt bắn keydown lặp lại với repeat = true -> chỉ kêu 1 lần.
      if (event.repeat) {
        return;
      }
      // Phím tắt (Ctrl+S, Cmd+K, Alt+D...) giữ nguyên cho trình duyệt.
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      // Đang ghép chữ bằng bộ gõ (IME).
      if (event.isComposing) {
        return;
      }
      if (isTypingTarget(event.target)) {
        return;
      }

      const pad = padMap.get(event.code);
      if (pad === undefined) {
        return;
      }

      event.preventDefault();
      onTriggerPad(pad.id);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [padMap, onTriggerPad, isEnabled]);
}
