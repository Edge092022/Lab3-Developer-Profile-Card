import { useEffect, useId, useState } from 'react';
import styles from './SituationshipAnalyzer.module.css';

const PHASES = Object.freeze({
  FRIENDS: 'FRIENDS',
  DATING_NO_LOVE: 'DATING_NO_LOVE',
  OFFICIAL_LOVE: 'OFFICIAL_LOVE',
  GHOSTED_EXIT: 'GHOSTED_EXIT',
  SELF_RESPECT_EXIT: 'SELF_RESPECT_EXIT',
});

// Bảng chuyển trạng thái: TRANSITIONS[phase hiện tại][sự kiện] = phase tiếp theo
const TRANSITIONS = Object.freeze({
  FRIENDS: { START_DATING: PHASES.DATING_NO_LOVE },
  DATING_NO_LOVE: {
    COMMIT: PHASES.OFFICIAL_LOVE,
    TIMEOUT: PHASES.GHOSTED_EXIT,
    STOP: PHASES.SELF_RESPECT_EXIT,
  },
  OFFICIAL_LOVE: { RESET: PHASES.FRIENDS },
  GHOSTED_EXIT: { RESET: PHASES.FRIENDS },
  SELF_RESPECT_EXIT: { RESET: PHASES.FRIENDS },
});

const PHASE_LABELS = Object.freeze({
  FRIENDS: 'Bạn bè',
  DATING_NO_LOVE: 'Hẹn hò nhưng không yêu',
  OFFICIAL_LOVE: 'Chính thức yêu',
  GHOSTED_EXIT: 'Bị ghost – seen không rep',
  SELF_RESPECT_EXIT: 'Tự trọng rời đi',
});

const INITIAL_MY_TRIES = 100; // 'Em cố trăm lần'
const INITIAL_RIVAL_TRIES = 1; // 'Ai đó một phần'
const MY_WEIGHT = 0.1;
const RIVAL_WEIGHT = 50;
const GHOSTING_TIMEOUT_MS = 5000;

// Hàm thuần: chỉ tra bảng, sự kiện không hợp lệ thì giữ nguyên phase
function nextPhase(current, event) {
  return TRANSITIONS[current][event] ?? current;
}

export function SituationshipAnalyzer() {
  const rivalInputId = useId();
  const [phase, setPhase] = useState(PHASES.FRIENDS);
  const [myTries, setMyTries] = useState(INITIAL_MY_TRIES);
  const [rivalTries, setRivalTries] = useState(INITIAL_RIVAL_TRIES);

  // Derived state: tính trực tiếp trong render, không lưu state, không useEffect
  const myImpact = myTries * MY_WEIGHT;
  const rivalImpact = rivalTries * RIVAL_WEIGHT;
  const canCommit = myImpact >= rivalImpact;
  const isRedFlag = phase === PHASES.DATING_NO_LOVE && !canCommit;
  const isFinal = TRANSITIONS[phase].RESET !== undefined;

  // 'Seen không rep': mỗi lần em gửi tin (myTries đổi) thì đếm lại 5s
  useEffect(() => {
    if (phase !== PHASES.DATING_NO_LOVE) return undefined;

    const timerId = window.setTimeout(() => {
      setPhase((current) => nextPhase(current, 'TIMEOUT'));
    }, GHOSTING_TIMEOUT_MS);

    return () => window.clearTimeout(timerId);
  }, [phase, myTries]);

  function send(event) {
    setPhase((current) => nextPhase(current, event));
  }

  function handleTryMore() {
    setMyTries((prev) => prev + 1);
  }

  function handleRivalChange(e) {
    const value = e.target.valueAsNumber;
    setRivalTries(Number.isNaN(value) ? 0 : Math.max(0, Math.floor(value)));
  }

  function handleReset() {
    send('RESET');
    setMyTries(INITIAL_MY_TRIES);
    setRivalTries(INITIAL_RIVAL_TRIES);
  }

  return (
    <article className={styles.card} aria-label="Hẹn Hò Nhưng Không Yêu Analyzer">
      <header>
        <h1 className={styles.title}>Hẹn Hò Nhưng Không Yêu</h1>
      </header>

      <p className={styles.phase}>
        Phase hiện tại: <strong>{PHASE_LABELS[phase]}</strong>
      </p>

      <dl className={styles.meter}>
        <dt>Em cố (× {MY_WEIGHT})</dt>
        <dd>
          {myTries} lần → {myImpact.toFixed(1)}
        </dd>
        <dt>Ai đó cố (× {RIVAL_WEIGHT})</dt>
        <dd>
          {rivalTries} lần → {rivalImpact.toFixed(1)}
        </dd>
      </dl>

      <p className={styles.field}>
        <label htmlFor={rivalInputId}>Ai đó cố bao nhiêu lần</label>
        <input
          id={rivalInputId}
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          value={rivalTries}
          onChange={handleRivalChange}
          disabled={isFinal}
        />
      </p>

      <output
        role="status"
        aria-live="polite"
        className={`${styles.status} ${isRedFlag ? styles.redFlag : ''}`}
      >
        {isRedFlag
          ? '[RED-FLAG] Hẹn hò nhưng không yêu — Giải phóng bộ nhớ!'
          : '[OK] Stable'}
      </output>

      <menu className={styles.actions}>
        {phase === PHASES.FRIENDS && (
          <li>
            <button type="button" onClick={() => send('START_DATING')}>
              Bắt đầu hẹn hò
            </button>
          </li>
        )}

        {phase === PHASES.DATING_NO_LOVE && (
          <>
            <li>
              <button type="button" onClick={handleTryMore}>
                Em cố thêm
              </button>
            </li>
            <li>
              <button type="button" onClick={() => send('COMMIT')} disabled={!canCommit}>
                Chính thức yêu
              </button>
            </li>
            <li>
              <button type="button" onClick={() => send('STOP')}>
                Dừng lại
              </button>
            </li>
          </>
        )}

        {isFinal && (
          <li>
            <button type="button" onClick={handleReset}>
              Làm lại từ đầu
            </button>
          </li>
        )}
      </menu>
    </article>
  );
}