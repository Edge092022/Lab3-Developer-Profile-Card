// Bộ tổng hợp nhiều giọng bằng Web Audio.
// Đây là class JavaScript thường, không phải class component React.

const SILENT_GAIN = 0.0001;
const ATTACK_SEC = 0.01;
const RELEASE_SEC = 0.04;
// Sau attack, tiếng giảm dần về 60% như dây đàn piano (hằng số thời gian 0.8s).
const SUSTAIN_RATIO = 0.6;
const DECAY_TIME_CONSTANT_SEC = 0.8;

export class PolyphonicSynth {
  #audioContext = null;
  #masterGain = null;
  // Map giữ thứ tự chèn: phần tử đầu tiên là nốt cũ nhất (FIFO).
  #voices = new Map();
  #isDisposed = false;

  constructor({
    maxVoices = 8,
    voiceGain = 0.12,
    masterVolume = 0.8,
    onVoiceStolen = null,
  } = {}) {
    this.maxVoices = maxVoices;
    this.voiceGain = voiceGain;
    this.masterVolume = masterVolume;
    // Gọi khi một nốt bị tắt để nhường chỗ cho nốt mới, để UI tắt sáng phím đó.
    this.onVoiceStolen = onVoiceStolen;
  }

  get activeMidis() {
    return Array.from(this.#voices.keys());
  }

  // Tạo AudioContext lười: chỉ tạo khi phát nốt đầu tiên (thường là do người dùng bấm).
  #ensureContext() {
    if (this.#audioContext === null) {
      this.#audioContext = new AudioContext();
      this.#masterGain = this.#audioContext.createGain();
      this.#masterGain.gain.value = this.masterVolume;
      this.#masterGain.connect(this.#audioContext.destination);
    }
    // Trình duyệt chặn autoplay: context có thể ở trạng thái 'suspended'.
    if (this.#audioContext.state === 'suspended') {
      this.#audioContext.resume().catch(() => {});
    }
    return this.#audioContext;
  }

  noteOn(midi, freqHz) {
    if (this.#isDisposed || this.#voices.has(midi)) {
      return;
    }

    // Đủ giọng: tắt nốt cũ nhất (đầu Map) trước khi thêm nốt mới.
    if (this.#voices.size >= this.maxVoices) {
      const oldestMidi = this.#voices.keys().next().value;
      this.noteOff(oldestMidi);
      this.onVoiceStolen?.(oldestMidi);
    }

    const audioContext = this.#ensureContext();
    const now = audioContext.currentTime;

    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(freqHz, now);

    // Attack 10ms từ gần 0 để không bị "bụp" khi bắt đầu.
    envelope.gain.setValueAtTime(SILENT_GAIN, now);
    envelope.gain.exponentialRampToValueAtTime(this.voiceGain, now + ATTACK_SEC);
    envelope.gain.setTargetAtTime(
      this.voiceGain * SUSTAIN_RATIO,
      now + ATTACK_SEC,
      DECAY_TIME_CONSTANT_SEC,
    );

    oscillator.connect(envelope);
    envelope.connect(this.#masterGain);
    oscillator.addEventListener(
      'ended',
      () => {
        oscillator.disconnect();
        envelope.disconnect();
      },
      { once: true },
    );
    oscillator.start(now);

    this.#voices.set(midi, { oscillator, envelope });
  }

  noteOff(midi) {
    const voice = this.#voices.get(midi);
    if (voice === undefined || this.#audioContext === null) {
      return;
    }
    // Xóa khỏi Map ngay để có thể bấm lại cùng nốt trong lúc nốt cũ đang tắt dần.
    this.#voices.delete(midi);

    const { oscillator, envelope } = voice;
    const now = this.#audioContext.currentTime;
    // Hủy các mốc đã lên lịch (attack/decay), giữ đúng mức hiện tại rồi giảm mượt 40ms.
    // Cắt đột ngột từ mức đang kêu xuống 0 sẽ gây tiếng "bụp".
    const currentGain = Math.max(envelope.gain.value, SILENT_GAIN);
    envelope.gain.cancelScheduledValues(now);
    envelope.gain.setValueAtTime(currentGain, now);
    envelope.gain.exponentialRampToValueAtTime(SILENT_GAIN, now + RELEASE_SEC);
    // stop sau khi ramp xong; disconnect trong listener 'ended'.
    oscillator.stop(now + RELEASE_SEC + 0.01);
  }

  allNotesOff() {
    for (const midi of this.activeMidis) {
      this.noteOff(midi);
    }
  }

  // Gọi khi unmount: tắt mọi nốt, ngắt master và đóng AudioContext.
  dispose() {
    if (this.#isDisposed) {
      return;
    }
    this.#isDisposed = true;
    this.allNotesOff();
    if (this.#audioContext !== null) {
      this.#masterGain.disconnect();
      this.#audioContext.close().catch(() => {});
      this.#audioContext = null;
      this.#masterGain = null;
    }
  }
}
