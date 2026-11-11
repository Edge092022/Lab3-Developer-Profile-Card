import { usePubgAirdropTimer } from '../hooks/usePubgAirdropTimer.js';
import { SALE_DURATION_MS } from '../data/crates.js';

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

function CrateCard({ crate }) {
  const { id, name, stock } = crate;
  const { remainingMs: msToDrop } = usePubgAirdropTimer(crate.dropEpochMs);
  const { remainingMs: msToExpire } = usePubgAirdropTimer(
    crate.dropEpochMs + SALE_DURATION_MS,
  );

  const phase = getAirdropPhase({ msToDrop, msToExpire, stock });
  const isLootedOut = phase === 'LOOTED_OUT';

  const clockLabel = phase === 'WARMUP' ? 'Drop sau' : 'Hết hạn sau';
  const clockMs = phase === 'WARMUP' ? msToDrop : msToExpire;
  const clockSeconds = Math.ceil(clockMs / 1000);

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
          <dt className="lbl">{clockLabel}</dt>
          <dd>
            <time className="timer" dateTime={`PT${clockSeconds}S`}>
              {formatRemaining(clockMs)}
            </time>
          </dd>
        </div>
      </dl>
    </li>
  );
}

export default CrateCard;
