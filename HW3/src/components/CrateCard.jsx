import { useEffect, useRef, useState } from 'react';
import { usePubgAirdropTimer } from '../hooks/usePubgAirdropTimer.js';
import { SALE_DURATION_MS } from '../data/crates.js';
import { claimCrate } from '../api/fakeClaimServer.js';
import styles from './CrateCard.module.css';

// Tạo một lần cho cả module, không tạo lại mỗi lần render.
const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

const CLAIM_BUTTON_TEXT = {
  IDLE: 'Claim',
  PENDING: 'Đang nhận…',
  CLAIMED: 'Đã nhận',
};

const PHASE_ANNOUNCEMENT = {
  WARMUP: 'đang chờ drop.',
  AIRDROP_LIVE: 'đã mở bán.',
  LOOTED_OUT: 'đã hết hàng.',
  EXPIRED: 'đã hết hạn.',
};

// Hàm thuần: suy ra phase từ thời gian còn lại và kho.
// Thứ tự ưu tiên: WARMUP -> EXPIRED -> LOOTED_OUT -> AIRDROP_LIVE.
function getAirdropPhase({ msToDrop, msToExpire, stock }) {
  if (msToDrop > 0) {
    return 'WARMUP';
  }
  if (msToExpire === 0) {
    return 'EXPIRED';
  }
  if (stock === 0) {
    return 'LOOTED_OUT';
  }
  return 'AIRDROP_LIVE';
}

function formatRemaining(remainingMs) {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function CrateCard({ crate, onStockChange, onAnnounce }) {
  const { id, name, stock, priceVnd } = crate;
  const { remainingMs: msToDrop } = usePubgAirdropTimer(crate.dropEpochMs);
  const { remainingMs: msToExpire } = usePubgAirdropTimer(
    crate.dropEpochMs + SALE_DURATION_MS,
  );

  // 'IDLE' | 'PENDING' | 'CLAIMED'
  const [claimStatus, setClaimStatus] = useState('IDLE');
  const [claimError, setClaimError] = useState(null);
  const abortControllerRef = useRef(null);

  // Unmount: hủy request đang chờ. Không rollback vì crate chỉ unmount cùng cả app.
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const phase = getAirdropPhase({ msToDrop, msToExpire, stock });

  // Phase đổi do đồng hồ (hệ thống bên ngoài), không có event handler nào để gắn thông báo,
  // nên dùng effect để báo cho cha. Effect chỉ thông báo, không tính hay lưu lại phase.
  const previousPhaseRef = useRef(phase);
  useEffect(() => {
    if (previousPhaseRef.current === phase) {
      return;
    }
    previousPhaseRef.current = phase;
    onAnnounce(`${name}: ${PHASE_ANNOUNCEMENT[phase]}`);
  }, [phase, name, onAnnounce]);

  const isLootedOut = phase === 'LOOTED_OUT';
  const canClaim = phase === 'AIRDROP_LIVE' && claimStatus === 'IDLE';

  const clockLabel = phase === 'WARMUP' ? 'Drop sau' : 'Hết hạn sau';
  const clockMs = phase === 'WARMUP' ? msToDrop : msToExpire;
  const clockSeconds = Math.ceil(clockMs / 1000);

  async function handleClaim() {
    if (!canClaim) {
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Optimistic: trừ kho trên UI ngay, khóa nút, rồi mới gửi request.
    onStockChange(id, -1);
    setClaimStatus('PENDING');
    setClaimError(null);

    try {
      await claimCrate(id, { signal: abortController.signal });
      setClaimStatus('CLAIMED');
      onAnnounce(`${name}: nhận crate thành công.`);
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      // Rollback: cộng lại đúng 1 vé đã trừ optimistic.
      onStockChange(id, 1);
      setClaimStatus('IDLE');
      onAnnounce(
        error.status === 409
          ? `${name}: claim thất bại (409), đã trả lại 1 vé.`
          : `${name}: claim thất bại, đã trả lại 1 vé.`,
      );
      setClaimError(
        error.status === 409
          ? 'Không nhận được: crate đã bị người khác nhận trước. Số vé đã được trả lại.'
          : 'Không nhận được crate. Số vé đã được trả lại, vui lòng thử lại.',
      );
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }

  const cardClassName = isLootedOut
    ? `${styles.card} ${styles.empty}`
    : styles.card;

  return (
    <li className={cardClassName} data-kanji="補">
      <h2 className={styles.tab}>{name}</h2>
      {isLootedOut && (
        <p className={styles.seal}>
          HẾT
          <br />
          HÀNG
        </p>
      )}

      <dl className={styles.details}>
        <div className={styles.row}>
          <dt className={styles.lbl}>Phase</dt>
          <dd className={styles.phase}>{phase}</dd>
        </div>

        <div className={styles.row}>
          <dt className={styles.lbl}>Kho</dt>
          <dd className={styles.stock}>
            <span className={styles.hex}>{stock}</span>
          </dd>
        </div>

        <div className={styles.row}>
          <dt className={styles.lbl}>Giá</dt>
          <dd className={styles.price}>{vndFormatter.format(priceVnd)}</dd>
        </div>

        <div className={styles.row}>
          <dt className={styles.lbl}>{clockLabel}</dt>
          <dd>
            <time className={styles.timer} dateTime={`PT${clockSeconds}S`}>
              {formatRemaining(clockMs)}
            </time>
          </dd>
        </div>
      </dl>

      <button
        type="button"
        className={styles.claim}
        onClick={handleClaim}
        disabled={!canClaim}
      >
        {CLAIM_BUTTON_TEXT[claimStatus]}
      </button>

      {claimError !== null && (
        <p role="alert" className={styles.claimError}>
          {claimError}
        </p>
      )}
    </li>
  );
}

export default CrateCard;
