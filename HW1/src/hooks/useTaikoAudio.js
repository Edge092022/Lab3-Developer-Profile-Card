import { useCallback, useEffect, useRef } from 'react';

const DEFAULT_VOLUME = 70;
// exponentialRamp không về được đúng 0, dùng mức gần như im lặng.
const SILENT_GAIN = 0.0001;

// Một lớp âm: oscillator -> gain (envelope) -> destination.
// Tần số trượt từ startHz xuống endHz để có cảm giác "đập" của trống.
// Tự stop() và disconnect() khi kết thúc để không giữ node trong bộ nhớ.
function playLayer(audioContext, destination, layer) {
  const { type, startHz, endHz, peakGain, attackSec, decaySec } = layer;
  const startTime = audioContext.currentTime;
  const peakTime = startTime + attackSec;
  const endTime = peakTime + decaySec;

  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(startHz, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(endHz, endTime);

  envelope.gain.setValueAtTime(SILENT_GAIN, startTime);
  envelope.gain.exponentialRampToValueAtTime(peakGain, peakTime);
  envelope.gain.exponentialRampToValueAtTime(SILENT_GAIN, endTime);

  oscillator.connect(envelope);
  envelope.connect(destination);

  oscillator.addEventListener(
    'ended',
    () => {
      oscillator.disconnect();
      envelope.disconnect();
    },
    { once: true },
  );

  oscillator.start(startTime);
  oscillator.stop(endTime + 0.02);
}

// Công thức tiếng cho từng kind. Mỗi tiếng gồm vài lớp chồng lên nhau.
const SOUND_RECIPES = {
  // Mặt trống: thân sine trầm 110 -> 70 Hz tắt ~300ms, thêm lớp triangle ngắn cho tiếng "đập".
  don: [
    { type: 'sine', startHz: 110, endHz: 70, peakGain: 0.9, attackSec: 0.005, decaySec: 0.3 },
    { type: 'triangle', startHz: 220, endHz: 110, peakGain: 0.25, attackSec: 0.003, decaySec: 0.1 },
  ],
  // Don lớn: trầm hơn, to hơn, ngân dài hơn don.
  bigdon: [
    { type: 'sine', startHz: 100, endHz: 55, peakGain: 1, attackSec: 0.005, decaySec: 0.55 },
    { type: 'triangle', startHz: 200, endHz: 90, peakGain: 0.35, attackSec: 0.003, decaySec: 0.18 },
  ],
  // Vành trống: tiếng gỗ khô, tần số cao, tắt ~80ms; thêm lớp square rất ngắn cho tiếng "cách".
  ka: [
    { type: 'triangle', startHz: 1400, endHz: 1100, peakGain: 0.6, attackSec: 0.002, decaySec: 0.08 },
    { type: 'square', startHz: 2800, endHz: 2400, peakGain: 0.06, attackSec: 0.001, decaySec: 0.03 },
  ],
  // Chuông lễ hội: sine cao, ngân ~1.2s; thêm 2 bội âm không điều hòa (×2.76, ×5.4) cho chất kim loại.
  bell: [
    { type: 'sine', startHz: 1320, endHz: 1310, peakGain: 0.4, attackSec: 0.003, decaySec: 1.2 },
    { type: 'sine', startHz: 3643, endHz: 3630, peakGain: 0.15, attackSec: 0.003, decaySec: 0.6 },
    { type: 'sine', startHz: 7128, endHz: 7100, peakGain: 0.06, attackSec: 0.002, decaySec: 0.3 },
  ],
};

function playRecipe(audioContext, destination, kind) {
  const layers = SOUND_RECIPES[kind];
  if (layers === undefined) {
    return;
  }
  for (const layer of layers) {
    playLayer(audioContext, destination, layer);
  }
}

export function useTaikoAudio() {
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  // Giữ âm lượng ở ref để AudioContext tạo lại (StrictMode) vẫn dùng đúng mức đang chọn.
  const volumeRef = useRef(DEFAULT_VOLUME / 100);

  useEffect(() => {
    const audioContext = new AudioContext();
    const masterGain = audioContext.createGain();
    // Compressor chặn vỡ tiếng khi gõ dồn nhiều nốt chồng lên nhau.
    const compressor = audioContext.createDynamicsCompressor();

    masterGain.gain.value = volumeRef.current;
    masterGain.connect(compressor);
    compressor.connect(audioContext.destination);

    audioContextRef.current = audioContext;
    masterGainRef.current = masterGain;

    return () => {
      audioContextRef.current = null;
      masterGainRef.current = null;
      masterGain.disconnect();
      compressor.disconnect();
      audioContext.close();
    };
  }, []);

  const playPad = useCallback((kind) => {
    const audioContext = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (audioContext === null || masterGain === null) {
      return;
    }

    // Trình duyệt tạo AudioContext ở trạng thái 'suspended' cho tới khi có thao tác người dùng.
    // Lần phát đầu tiên (do bấm phím/chuột) gọi resume() rồi mới phát.
    if (audioContext.state === 'suspended') {
      audioContext
        .resume()
        .then(() => playRecipe(audioContext, masterGain, kind))
        .catch(() => {});
      return;
    }

    playRecipe(audioContext, masterGain, kind);
  }, []);

  // volume: 0–100. Giá trị không hợp lệ (NaN) thì bỏ qua.
  const setVolume = useCallback((volume) => {
    if (Number.isNaN(volume)) {
      return;
    }
    const clampedVolume = Math.min(100, Math.max(0, volume));
    volumeRef.current = clampedVolume / 100;

    const audioContext = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (audioContext === null || masterGain === null) {
      return;
    }
    // setTargetAtTime đổi mượt trong ~10ms, tránh tiếng "tách" khi kéo thanh âm lượng.
    masterGain.gain.setTargetAtTime(volumeRef.current, audioContext.currentTime, 0.01);
  }, []);

  return { playPad, setVolume };
}
