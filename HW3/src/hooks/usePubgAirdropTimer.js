import { useEffect, useState } from 'react';

const TICK_MS = 200;

function computeRemainingMs(targetEpochMs, serverOffsetMs) {
  const serverNowMs = Date.now() + serverOffsetMs;
  return Math.max(0, targetEpochMs - serverNowMs);
}

export function usePubgAirdropTimer(targetEpochMs, serverOffsetMs = 0) {
  const [remainingMs, setRemainingMs] = useState(() =>
    computeRemainingMs(targetEpochMs, serverOffsetMs),
  );

  useEffect(() => {
    let intervalId = null;

    function stopInterval() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function sync() {
      const nextRemainingMs = computeRemainingMs(targetEpochMs, serverOffsetMs);
      setRemainingMs(nextRemainingMs);
      if (nextRemainingMs === 0) {
        stopInterval();
      }
      return nextRemainingMs;
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        sync();
      }
    }

    if (sync() > 0) {
      intervalId = setInterval(sync, TICK_MS);
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopInterval();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [targetEpochMs, serverOffsetMs]);

    return { remainingMs, isLive: remainingMs === 0 };
}
