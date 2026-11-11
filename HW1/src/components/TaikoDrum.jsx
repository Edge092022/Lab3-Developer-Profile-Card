import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useDrumKeyboard } from '../hooks/useDrumKeyboard.js';
import { useTaikoAudio } from '../hooks/useTaikoAudio.js';
import { PADS, PADS_BY_ID } from '../data/pads.js';
import styles from './TaikoDrum.module.css';

// Thứ tự hiển thị theo bàn phím: A S D W J K L.
const PAD_LIST = Array.from(PADS.values());

const HIT_LOG_LIMIT = 10;
const FLASH_MS = 120;
const FLOATER_MS = 700;
const FLOATER_REDUCED_MOTION_MS = 400;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const SOUL_MAX = 100;
const SOUL_DECAY_STEP = 2;
const SOUL_DECAY_INTERVAL_MS = 100;
const SOUL_GAIN_BY_KIND = {
  don: 8,
  ka: 8,
  bigdon: 15,
  bell: 5,
};

const DEFAULT_VOLUME = 70;

// Chữ hiện khi gõ (hit log và chữ bay).
const SHOUT_BY_KIND = {
  don: '「ドン!」',
  bigdon: '「ドーン!」',
  ka: '「カッ!」',
  bell: '「リン!」',
};

const PAD_CLASS_BY_KIND = {
  don: styles.padDon,
  bigdon: styles.padBigdon,
  ka: styles.padKa,
  bell: styles.padBell,
};

const INK_CLASS_BY_KIND = {
  don: styles.inkDon,
  bigdon: styles.inkDon,
  ka: styles.inkKa,
  bell: styles.inkBell,
};

function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function TaikoDrum() {
  const [playerName, setPlayerName] = useState('');
  const [volume, setVolumeLevel] = useState(DEFAULT_VOLUME);
  // Các pad đang nháy sáng (có thể nhiều pad cùng lúc).
  const [activePadIds, setActivePadIds] = useState([]);
  // 10 lần gõ gần nhất, mới nhất đứng đầu.
  const [hits, setHits] = useState([]);
  // Chữ bay đang hiển thị.
  const [floaters, setFloaters] = useState([]);
  const [soul, setSoul] = useState(0);

  const playerNameId = useId();
  const volumeId = useId();
  const soulId = useId();
  const padsHeadingId = useId();
  const logHeadingId = useId();

  const { playPad, setVolume } = useTaikoAudio();

  // id ổn định cho mỗi lần gõ (dùng làm key), không dùng index.
  const nextHitIdRef = useRef(0);
  // Timer nháy sáng theo từng pad và timer gỡ chữ bay, để dọn khi unmount.
  const flashTimersRef = useRef(new Map());
  const floaterTimersRef = useRef(new Set());

  useEffect(() => {
    const flashTimers = flashTimersRef.current;
    const floaterTimers = floaterTimersRef.current;
    return () => {
      flashTimers.forEach((timeoutId) => clearTimeout(timeoutId));
      flashTimers.clear();
      floaterTimers.forEach((timeoutId) => clearTimeout(timeoutId));
      floaterTimers.clear();
    };
  }, []);

  // Gauge tụt 2 mỗi 100ms; interval chỉ tồn tại khi gauge > 0.
  // Deps là boolean nên interval không bị tạo lại sau mỗi lần tụt.
  const isSoulActive = soul > 0;
  useEffect(() => {
    if (!isSoulActive) {
      return undefined;
    }
    const intervalId = setInterval(() => {
      setSoul((previousSoul) => Math.max(0, previousSoul - SOUL_DECAY_STEP));
    }, SOUL_DECAY_INTERVAL_MS);
    return () => {
      clearInterval(intervalId);
    };
  }, [isSoulActive]);

  // Chuột và bàn phím đi chung hàm này.
  const triggerPad = useCallback(
    (padId) => {
      const pad = PADS_BY_ID.get(padId);
      if (pad === undefined) {
        return;
      }

      playPad(pad.kind);

      // Nháy sáng 120ms; gõ lại khi đang sáng thì tính lại 120ms từ đầu.
      const flashTimers = flashTimersRef.current;
      clearTimeout(flashTimers.get(padId));
      setActivePadIds((previousIds) =>
        previousIds.includes(padId) ? previousIds : [...previousIds, padId],
      );
      flashTimers.set(
        padId,
        setTimeout(() => {
          flashTimers.delete(padId);
          setActivePadIds((previousIds) => previousIds.filter((id) => id !== padId));
        }, FLASH_MS),
      );

      nextHitIdRef.current += 1;
      const hit = {
        id: nextHitIdRef.current,
        padId,
        kind: pad.kind,
        key: pad.key,
        shout: SHOUT_BY_KIND[pad.kind],
      };

      setHits((previousHits) => [hit, ...previousHits].slice(0, HIT_LOG_LIMIT));

      // Chữ bay: gỡ bằng timer (không dựa vào onAnimationEnd vì reduced-motion không có animation).
      const floaterTimers = floaterTimersRef.current;
      setFloaters((previousFloaters) => [...previousFloaters, hit]);
      const floaterTimeoutId = setTimeout(
        () => {
          floaterTimers.delete(floaterTimeoutId);
          setFloaters((previousFloaters) =>
            previousFloaters.filter((floater) => floater.id !== hit.id),
          );
        },
        prefersReducedMotion() ? FLOATER_REDUCED_MOTION_MS : FLOATER_MS,
      );
      floaterTimers.add(floaterTimeoutId);

      setSoul((previousSoul) =>
        Math.min(SOUL_MAX, previousSoul + SOUL_GAIN_BY_KIND[pad.kind]),
      );
    },
    [playPad],
  );

  useDrumKeyboard(PADS, triggerPad);

  function handleVolumeChange(event) {
    const nextVolume = event.target.valueAsNumber;
    if (Number.isNaN(nextVolume)) {
      return;
    }
    setVolumeLevel(nextVolume);
    setVolume(nextVolume);
  }

  const displayName = playerName.trim() === '' ? 'Khách' : playerName.trim();
  const latestHit = hits.length > 0 ? hits[0] : null;

  return (
    <main className={styles.dojo}>
      <header className={styles.header}>
        <h1 className={styles.title}>Matsuri Drum Dojo</h1>
        <p className={styles.player}>Người chơi: {displayName}</p>
      </header>

      <section className={styles.settings} aria-label="Cài đặt">
        <div className={styles.field}>
          <label htmlFor={playerNameId} className={styles.label}>
            Tên người chơi
          </label>
          <input
            id={playerNameId}
            type="text"
            className={styles.textInput}
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            maxLength={24}
            autoComplete="off"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={volumeId} className={styles.label}>
            Âm lượng <span className={styles.volumeValue}>{volume}</span>
          </label>
          <input
            id={volumeId}
            type="range"
            className={styles.range}
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </section>

      <section className={styles.panel} aria-labelledby={padsHeadingId}>
        <h2 id={padsHeadingId} className={styles.panelTitle}>
          Trống
        </h2>
        <p className={styles.hint}>
          Bấm chuột hoặc gõ phím A S D W J K L.
        </p>

        <div className={styles.stage}>
          <ul className={styles.pads}>
            {PAD_LIST.map((pad) => {
              const isActive = activePadIds.includes(pad.id);
              return (
                <li key={pad.id} className={styles.padItem}>
                  <button
                    type="button"
                    className={`${styles.pad} ${PAD_CLASS_BY_KIND[pad.kind]}`}
                    aria-pressed={isActive}
                    aria-keyshortcuts={pad.key}
                    onClick={() => triggerPad(pad.id)}
                  >
                    <span lang="ja" className={styles.padLabel}>
                      {pad.label}
                    </span>{' '}
                    <span className={styles.padKey}>({pad.key})</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Trang trí; nội dung đã được báo qua <output> bên dưới. */}
          <div className={styles.floaters} aria-hidden="true">
            {floaters.map((floater) => (
              <span
                key={floater.id}
                lang="ja"
                className={`${styles.floater} ${INK_CLASS_BY_KIND[floater.kind]}`}
              >
                {floater.shout}
              </span>
            ))}
          </div>
        </div>

        <p className={styles.latest}>
          <output aria-live="polite">
            {latestHit === null ? (
              'Chưa gõ lần nào.'
            ) : (
              <span key={latestHit.id}>
                Vừa gõ: <span lang="ja">{latestHit.shout}</span> ({latestHit.key})
              </span>
            )}
          </output>
        </p>
      </section>

      <section className={styles.panel}>
        <div className={styles.gaugeHeader}>
          <label htmlFor={soulId} className={styles.label}>
            <span lang="ja">魂</span> Soul gauge
          </label>
          <span className={styles.gaugeValue} aria-hidden="true">
            {soul} / {SOUL_MAX}
          </span>
        </div>
        <meter
          id={soulId}
          className={styles.gauge}
          min={0}
          max={SOUL_MAX}
          value={soul}
        >
          {soul} / {SOUL_MAX}
        </meter>
      </section>

      <section className={styles.panel} aria-labelledby={logHeadingId}>
        <h2 id={logHeadingId} className={styles.panelTitle}>
          Lịch sử gõ ({hits.length}/{HIT_LOG_LIMIT})
        </h2>
        {hits.length === 0 ? (
          <p className={styles.hint}>Chưa có lần gõ nào.</p>
        ) : (
          // role="list": giữ ngữ nghĩa danh sách trên Safari khi list-style: none.
          <ol className={styles.log} role="list">
            {hits.map((hit) => (
              <li key={hit.id} className={`${styles.logItem} ${INK_CLASS_BY_KIND[hit.kind]}`}>
                <span lang="ja">{hit.shout}</span>{' '}
                <span className={styles.logKey}>({hit.key})</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

export default TaikoDrum;
