import { useEffect, useRef, useState } from 'react';
import { usePubgAirdropTimer } from '../hooks/usePubgAirdropTimer.js';
import { SALE_DURATION_MS } from '../data/crates.js';
import { claimCrate } from '../api/fakeClaimServer.js';

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

function CrateCard({ crate, onStockChange }) {
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
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      // Rollback: cộng lại đúng 1 vé đã trừ optimistic.
      onStockChange(id, 1);
      setClaimStatus('IDLE');
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

  return (
    <li className={`card ${id}${isLootedOut ? ' empty' : ''}`} data-kanji="補">
      <h2 className="tab">{name}</h2>
      {isLootedOut && (
        <p className="seal">
          HẾT
          <br />
          HÀNG
        </p>
      )}

      <dl>
        <div className="row">
          <dt className="lbl">Phase</dt>
          <dd className="phase">{phase}</dd>
        </div>

        <div className="row">
          <dt className="lbl">Kho</dt>
          <dd className="stock">
            <span className="hex">{stock}</span>
          </dd>
        </div>

        <div className="row">
          <dt className="lbl">Giá</dt>
          <dd className="price">{vndFormatter.format(priceVnd)}</dd>
        </div>

        <div className="row">
          <dt className="lbl">{clockLabel}</dt>
          <dd>
            <time className="timer" dateTime={`PT${clockSeconds}S`}>
              {formatRemaining(clockMs)}
            </time>
          </dd>
        </div>
      </dl>

      <button
        type="button"
        className="claim"
        onClick={handleClaim}
        disabled={!canClaim}
      >
        {CLAIM_BUTTON_TEXT[claimStatus]}
      </button>

      {claimError !== null && (
        <p role="alert" className="claim-error">
          {claimError}
        </p>
      )}
    </li>
  );
}

export default CrateCard;
