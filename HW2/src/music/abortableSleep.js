function createAbortError() {
  return new DOMException('Playback was aborted.', 'AbortError');
}

// Chờ ms mili giây; signal bị abort thì reject AbortError ngay và hủy timer.
export function abortableSleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(createAbortError());
      return;
    }

    function handleAbort() {
      clearTimeout(timeoutId);
      reject(createAbortError());
    }

    const timeoutId = setTimeout(() => {
      signal.removeEventListener('abort', handleAbort);
      resolve();
    }, ms);

    signal.addEventListener('abort', handleAbort, { once: true });
  });
}
