// Thời gian đếm ngược trước khi crate đầu tiên drop.
// Bản demo: 30 giây. Giá trị thật: 5 phút (5 * 60 * 1000).
export const COUNTDOWN_MS = 30 * 1000;

// Thời gian mở bán sau khi drop, hết thời gian này thì crate EXPIRED.
// Bản demo: 30 giây. Giá trị thật: 5 phút (5 * 60 * 1000).
export const SALE_DURATION_MS = 30 * 1000;

// Khoảng lệch giờ drop giữa các crate để demo nhiều phase cùng lúc.
const DROP_GAP_MS = 10 * 1000;

// Tính một lần khi tải module; reload trang thì đếm lại từ đầu.
const MODULE_LOADED_AT_MS = Date.now();

export const CRATES = [
  {
    id: 'crate-erangel',
    name: 'Erangel Supply Crate',
    stock: 5,
    priceVnd: 50000,
    dropEpochMs: MODULE_LOADED_AT_MS + COUNTDOWN_MS,
  },
  {
    id: 'crate-miramar',
    name: 'Miramar Supply Crate',
    stock: 3,
    priceVnd: 80000,
    dropEpochMs: MODULE_LOADED_AT_MS + COUNTDOWN_MS + DROP_GAP_MS,
  },
  {
    id: 'crate-sanhok',
    name: 'Sanhok Supply Crate',
    stock: 0,
    priceVnd: 120000,
    dropEpochMs: MODULE_LOADED_AT_MS + COUNTDOWN_MS + DROP_GAP_MS * 2,
  },
];
