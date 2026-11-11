import { useCallback, useEffect, useId, useRef, useState } from 'react';
import PianoKey from './PianoKey.jsx';
import {
  PIANO_KEYS,
  FIRST_MIDI,
  LAST_MIDI,
  midiToNoteName,
} from '../music/pianoKeys.js';
import { PolyphonicSynth } from '../audio/PolyphonicSynth.js';
import { usePianoKeyboard, octaveToCMidi } from '../hooks/usePianoKeyboard.js';
import { abortableSleep } from '../music/abortableSleep.js';
import styles from './GrandPiano.module.css';

const KEY_BY_MIDI = new Map(PIANO_KEYS.map((pianoKey) => [pianoKey.midi, pianoKey]));

// Quãng mặc định C4; giới hạn để còn ít nhất 1 nốt nằm trong 88 phím (quãng 0: A0–C1, quãng 8: C8).
const DEFAULT_OCTAVE = 4;
const MIN_OCTAVE = 0;
const MAX_OCTAVE = 8;

const MAX_RECORDED_NOTES = 200;
// Nốt vẫn đang giữ lúc dừng ghi thì độ dài tính tới lúc dừng, tối thiểu 30ms để vẫn nghe được.
const MIN_NOTE_DURATION_MS = 30;

const SPEED_OPTIONS = [
  { value: '0.5', label: '0.5x (chậm)' },
  { value: '1', label: '1x (gốc)' },
  { value: '2', label: '2x (nhanh)' },
];

// 'IDLE' | 'RECORDING' | 'PLAYING'
const RECORDER_STATUS_LABEL = {
  IDLE: 'Sẵn sàng',
  RECORDING: 'Đang ghi',
  PLAYING: 'Đang phát',
};

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Cập nhật Set bất biến: tạo Set mới; không đổi gì thì trả lại Set cũ để React bỏ qua render.
function addToSet(previousSet, value) {
  if (previousSet.has(value)) {
    return previousSet;
  }
  const nextSet = new Set(previousSet);
  nextSet.add(value);
  return nextSet;
}

function removeFromSet(previousSet, value) {
  if (!previousSet.has(value)) {
    return previousSet;
  }
  const nextSet = new Set(previousSet);
  nextSet.delete(value);
  return nextSet;
}

function describeOctave(octave) {
  const firstMidi = Math.max(FIRST_MIDI, octaveToCMidi(octave));
  const lastMidi = Math.min(LAST_MIDI, octaveToCMidi(octave) + 12);
  if (firstMidi === lastMidi) {
    return midiToNoteName(firstMidi);
  }
  return `${midiToNoteName(firstMidi)}–${midiToNoteName(lastMidi)}`;
}

function GrandPiano() {
  const [pressedMidis, setPressedMidis] = useState(() => new Set());
  const [octave, setOctave] = useState(DEFAULT_OCTAVE);
  const [recorderStatus, setRecorderStatus] = useState('IDLE');
  // Bản ghi đã hoàn tất: [{ midi, freqHz, durationMs, deltaMs }]
  const [recording, setRecording] = useState([]);
  const [liveRecordedCount, setLiveRecordedCount] = useState(0);
  const [speed, setSpeed] = useState('1');
  // id tăng mỗi lần để trình đọc màn hình đọc cả khi nội dung trùng lần trước.
  const [announcement, setAnnouncement] = useState({ id: 0, text: '' });

  const controlsHeadingId = useId();
  const pianoHeadingId = useId();
  const speedSelectId = useId();

  const synthRef = useRef(null);
  // Bản sao trạng thái FSM cho các callback ổn định (useCallback deps rỗng) đọc giá trị mới nhất.
  const recorderStatusRef = useRef('IDLE');
  // Phiên ghi đang chạy: ghi vào ref (không render lại mỗi nốt), chép ra state khi kết thúc.
  const recordingSessionRef = useRef(null);
  const playbackControllerRef = useRef(null);
  const pendingNoteOffTimersRef = useRef(new Set());
  const keyboardFrameRef = useRef(null);
  const hasScrolledOnceRef = useRef(false);

  const announce = useCallback((text) => {
    setAnnouncement((previousAnnouncement) => ({
      id: previousAnnouncement.id + 1,
      text,
    }));
  }, []);

  const changeRecorderStatus = useCallback((nextStatus) => {
    recorderStatusRef.current = nextStatus;
    setRecorderStatus(nextStatus);
  }, []);

  const finishRecording = useCallback(
    (reason) => {
      const session = recordingSessionRef.current;
      if (session === null) {
        return;
      }
      recordingSessionRef.current = null;

      const nowMs = performance.now();
      // Tạo mảng mới, mỗi nốt là object mới chỉ gồm 4 trường của bản ghi.
      const finishedNotes = session.notes.map((note) => ({
        midi: note.midi,
        freqHz: note.freqHz,
        durationMs: Math.max(
          MIN_NOTE_DURATION_MS,
          note.durationMs ?? nowMs - note.startMs,
        ),
        deltaMs: note.deltaMs,
      }));

      setRecording(finishedNotes);
      setLiveRecordedCount(finishedNotes.length);
      changeRecorderStatus('IDLE');
      announce(
        reason === 'full'
          ? `Đã đủ ${MAX_RECORDED_NOTES} nốt, tự dừng ghi.`
          : `Đã dừng ghi: ${finishedNotes.length} nốt.`,
      );
    },
    [announce, changeRecorderStatus],
  );

  // Đóng một nốt đang ghi: tính durationMs. Nốt thứ 200 được nhả thì tự dừng ghi.
  const recordNoteEnd = useCallback(
    (midi) => {
      const session = recordingSessionRef.current;
      if (recorderStatusRef.current !== 'RECORDING' || session === null) {
        return;
      }
      const noteIndex = session.openNoteIndexByMidi.get(midi);
      if (noteIndex === undefined) {
        return;
      }
      session.openNoteIndexByMidi.delete(midi);
      const note = session.notes[noteIndex];
      note.durationMs = performance.now() - note.startMs;

      if (
        session.notes.length >= MAX_RECORDED_NOTES &&
        session.openNoteIndexByMidi.size === 0
      ) {
        finishRecording('full');
      }
    },
    [finishRecording],
  );

  // Chuột, phím Space/Enter, bàn phím máy tính và phát lại đều đi qua noteOn/noteOff.
  // useCallback với deps ổn định: 88 PianoKey (memo) không render lại khi chỉ 1 phím đổi.
  const noteOn = useCallback(
    (midi) => {
      const pianoKey = KEY_BY_MIDI.get(midi);
      if (pianoKey === undefined) {
        return;
      }
      synthRef.current?.noteOn(midi, pianoKey.freqHz);
      setPressedMidis((previousMidis) => addToSet(previousMidis, midi));

      const session = recordingSessionRef.current;
      if (
        recorderStatusRef.current !== 'RECORDING' ||
        session === null ||
        session.openNoteIndexByMidi.has(midi)
      ) {
        return;
      }
      // Đã đủ 200 nốt mà vẫn bấm thêm: dừng ghi, nốt mới vẫn kêu nhưng không được ghi.
      if (session.notes.length >= MAX_RECORDED_NOTES) {
        finishRecording('full');
        return;
      }

      const nowMs = performance.now();
      session.notes.push({
        midi,
        freqHz: pianoKey.freqHz,
        startMs: nowMs,
        durationMs: null,
        // Khoảng cách từ lúc nốt trước bắt đầu; nốt đầu tiên là 0.
        deltaMs: session.lastStartMs === null ? 0 : nowMs - session.lastStartMs,
      });
      session.openNoteIndexByMidi.set(midi, session.notes.length - 1);
      session.lastStartMs = nowMs;
      setLiveRecordedCount(session.notes.length);
    },
    [finishRecording],
  );

  const noteOff = useCallback(
    (midi) => {
      synthRef.current?.noteOff(midi);
      setPressedMidis((previousMidis) => removeFromSet(previousMidis, midi));
      recordNoteEnd(midi);
    },
    [recordNoteEnd],
  );

  // Synth tắt nốt cũ nhất để nhường chỗ (FIFO): tắt sáng phím đó và đóng nốt nếu đang ghi.
  const handleVoiceStolen = useCallback(
    (midi) => {
      setPressedMidis((previousMidis) => removeFromSet(previousMidis, midi));
      recordNoteEnd(midi);
    },
    [recordNoteEnd],
  );

  const releaseAll = useCallback(() => {
    synthRef.current?.allNotesOff();
    setPressedMidis((previousMidis) =>
      previousMidis.size === 0 ? previousMidis : new Set(),
    );
    const session = recordingSessionRef.current;
    if (session !== null) {
      for (const midi of Array.from(session.openNoteIndexByMidi.keys())) {
        recordNoteEnd(midi);
      }
    }
  }, [recordNoteEnd]);

  const shiftOctave = useCallback(
    (delta) => {
      const nextOctave = Math.min(MAX_OCTAVE, Math.max(MIN_OCTAVE, octave + delta));
      if (nextOctave === octave) {
        announce(
          `Đã ở quãng ${delta < 0 ? 'thấp' : 'cao'} nhất: ${describeOctave(octave)}.`,
        );
        return;
      }
      setOctave(nextOctave);
      announce(`Quãng hiện tại: ${describeOctave(nextOctave)}.`);
    },
    [octave, announce],
  );

  usePianoKeyboard({
    octave,
    onNoteOn: noteOn,
    onNoteOff: noteOff,
    onOctaveShift: shiftOctave,
    onReleaseAll: releaseAll,
  });

  // Một synth cho cả đàn; dispose (tắt hết + đóng AudioContext) khi unmount.
  useEffect(() => {
    const synth = new PolyphonicSynth({ onVoiceStolen: handleVoiceStolen });
    synthRef.current = synth;
    return () => {
      synth.dispose();
      synthRef.current = null;
    };
  }, [handleVoiceStolen]);

  // Unmount giữa lúc phát: hủy vòng phát và mọi timer noteOff đang chờ.
  useEffect(() => {
    const pendingNoteOffTimers = pendingNoteOffTimersRef.current;
    return () => {
      playbackControllerRef.current?.abort();
      pendingNoteOffTimers.forEach((timeoutId) => clearTimeout(timeoutId));
      pendingNoteOffTimers.clear();
    };
  }, []);

  // Đổi quãng: cuộn khung piano tới Đô của quãng (đồng bộ DOM nên dùng effect).
  // Cuộn chính khung (scrollTo) thay vì scrollIntoView để trang không bị kéo theo chiều dọc.
  useEffect(() => {
    const frame = keyboardFrameRef.current;
    if (frame === null) {
      return;
    }
    const targetMidi = Math.max(FIRST_MIDI, octaveToCMidi(octave));
    const targetKey = frame.querySelector(`[data-midi="${targetMidi}"]`);
    if (targetKey === null) {
      return;
    }
    const shouldAnimate =
      hasScrolledOnceRef.current && !window.matchMedia(REDUCED_MOTION_QUERY).matches;
    hasScrolledOnceRef.current = true;
    frame.scrollTo({
      left: targetKey.offsetLeft,
      behavior: shouldAnimate ? 'smooth' : 'auto',
    });
  }, [octave]);

  function startRecording() {
    if (recorderStatusRef.current !== 'IDLE') {
      return;
    }
    recordingSessionRef.current = {
      notes: [],
      openNoteIndexByMidi: new Map(),
      lastStartMs: null,
    };
    setLiveRecordedCount(0);
    changeRecorderStatus('RECORDING');
    announce(`Bắt đầu ghi, tối đa ${MAX_RECORDED_NOTES} nốt.`);
  }

  function clearPendingNoteOffTimers() {
    const pendingNoteOffTimers = pendingNoteOffTimersRef.current;
    pendingNoteOffTimers.forEach((timeoutId) => clearTimeout(timeoutId));
    pendingNoteOffTimers.clear();
  }

  async function playRecording() {
    if (recorderStatusRef.current !== 'IDLE' || recording.length === 0) {
      return;
    }
    const notesToPlay = recording;
    const playbackSpeed = Number(speed);
    const controller = new AbortController();
    playbackControllerRef.current = controller;
    const pendingNoteOffTimers = pendingNoteOffTimersRef.current;

    changeRecorderStatus('PLAYING');
    announce(`Bắt đầu phát ${notesToPlay.length} nốt, tốc độ ${speed}x.`);

    try {
      // Tốc độ chia cả khoảng cách giữa các nốt và độ dài mỗi nốt.
      let cursorMs = 0;
      let endMs = 0;
      for (const note of notesToPlay) {
        const waitMs = note.deltaMs / playbackSpeed;
        await abortableSleep(waitMs, controller.signal);
        cursorMs += waitMs;

        noteOn(note.midi);
        const durationMs = note.durationMs / playbackSpeed;
        endMs = Math.max(endMs, cursorMs + durationMs);
        const timeoutId = setTimeout(() => {
          pendingNoteOffTimers.delete(timeoutId);
          noteOff(note.midi);
        }, durationMs);
        pendingNoteOffTimers.add(timeoutId);
      }
      // Chờ nốt cuối nhả xong rồi mới báo kết thúc.
      await abortableSleep(Math.max(0, endMs - cursorMs), controller.signal);
      announce('Đã phát xong.');
    } catch (error) {
      // Stop hoặc unmount: abort là chủ động, không phải lỗi.
      if (error.name !== 'AbortError') {
        throw error;
      }
    } finally {
      // Chỉ phiên phát hiện tại mới được trả FSM về IDLE (Stop đã tự làm việc này).
      if (playbackControllerRef.current === controller) {
        playbackControllerRef.current = null;
        changeRecorderStatus('IDLE');
      }
    }
  }

  function stopPlayback() {
    const controller = playbackControllerRef.current;
    if (controller === null) {
      return;
    }
    playbackControllerRef.current = null;
    controller.abort();
    clearPendingNoteOffTimers();
    synthRef.current?.allNotesOff();
    setPressedMidis(new Set());
    changeRecorderStatus('IDLE');
    announce('Đã dừng phát.');
  }

  function handleStop() {
    if (recorderStatusRef.current === 'RECORDING') {
      finishRecording('manual');
      return;
    }
    if (recorderStatusRef.current === 'PLAYING') {
      stopPlayback();
    }
  }

  const isIdle = recorderStatus === 'IDLE';
  const recordedSummary =
    recorderStatus === 'RECORDING'
      ? `Đã ghi ${liveRecordedCount}/${MAX_RECORDED_NOTES} nốt`
      : `Bản ghi: ${recording.length} nốt`;

  return (
    <main className={styles.hall}>
      <header className={styles.header}>
        <h1 className={styles.title}>Midnight Concert Piano 88</h1>
        <p className={styles.subtitle}>Một cây đàn, 88 phím, sân khấu lúc nửa đêm.</p>
      </header>

      <section className={styles.panel} aria-labelledby={controlsHeadingId}>
        <h2 id={controlsHeadingId} className={styles.panelTitle}>
          Ghi âm và phát lại
        </h2>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.button}
            onClick={startRecording}
            disabled={!isIdle}
          >
            <span className={styles.recordDot} aria-hidden="true">
              ●
            </span>{' '}
            Ghi
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={playRecording}
            disabled={!isIdle || recording.length === 0}
          >
            <span aria-hidden="true">▶</span> Phát
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={handleStop}
            disabled={isIdle}
          >
            <span aria-hidden="true">■</span> Stop
          </button>

          <div className={styles.field}>
            <label htmlFor={speedSelectId} className={styles.label}>
              Tốc độ phát
            </label>
            <select
              id={speedSelectId}
              className={styles.select}
              value={speed}
              onChange={(event) => setSpeed(event.target.value)}
              disabled={recorderStatus === 'PLAYING'}
            >
              {SPEED_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className={styles.meta}>
          Trạng thái: {RECORDER_STATUS_LABEL[recorderStatus]} · {recordedSummary}
        </p>

        <output role="status" aria-live="polite" className={styles.status}>
          <span key={announcement.id}>{announcement.text}</span>
        </output>
      </section>

      <section className={styles.panel} aria-labelledby={pianoHeadingId}>
        <h2 id={pianoHeadingId} className={styles.panelTitle}>
          Bàn phím
        </h2>
        <p className={styles.meta}>
          Quãng hiện tại: <strong className={styles.octave}>{describeOctave(octave)}</strong>.
          Phím máy tính A W S E D F T G Y H U J K; Z/X đổi quãng.
        </p>

        {/* Khung cuộn ngang riêng: đàn rộng ~2080px, trang thì không cuộn ngang. */}
        <div ref={keyboardFrameRef} className={styles.keyboardFrame}>
          <div className={styles.keyboard} role="group" aria-label="Đàn piano 88 phím">
            {PIANO_KEYS.map((pianoKey) => (
              <PianoKey
                key={pianoKey.midi}
                midi={pianoKey.midi}
                noteName={pianoKey.noteName}
                isBlack={pianoKey.isBlack}
                isPressed={pressedMidis.has(pianoKey.midi)}
                onNoteOn={noteOn}
                onNoteOff={noteOff}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default GrandPiano;
