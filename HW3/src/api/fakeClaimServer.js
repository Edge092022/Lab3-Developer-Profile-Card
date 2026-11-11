import { CRATES } from '../data/crates.js';

// Server giả lập: trễ khoảng 1 giây, còn hàng thì 35% trả 409.
const CLAIM_DELAY_MS = 1000;
const CONFLICT_RATE = 0.35;

// Kho riêng của server, khởi tạo từ cùng nguồn CRATES với UI.
// UI trừ kho optimistic trên state của mình; kho này chỉ đổi khi claim thành công.
const serverStockById = new Map(CRATES.map((crate) => [crate.id, crate.stock]));

function createConflictError(crateId) {
  const error = new Error(`Crate ${crateId} đã hết hoặc bị người khác nhận trước.`);
  error.status = 409;
  return error;
}

function createAbortError() {
  return new DOMException('Claim request was aborted.', 'AbortError');
}

export function claimCrate(crateId, { signal } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    function handleAbort() {
      clearTimeout(timeoutId);
      reject(createAbortError());
    }

    const timeoutId = setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort);

      const serverStock = serverStockById.get(crateId) ?? 0;
      if (serverStock === 0) {
        reject(createConflictError(crateId));
        return;
      }
      if (Math.random() < CONFLICT_RATE) {
        reject(createConflictError(crateId));
        return;
      }

      serverStockById.set(crateId, serverStock - 1);
      resolve({ crateId, remainingStock: serverStock - 1 });
    }, CLAIM_DELAY_MS);

    signal?.addEventListener('abort', handleAbort, { once: true });
  });
}
