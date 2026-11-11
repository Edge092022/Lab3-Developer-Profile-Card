// Map theo e.code (vị trí phím vật lý), không theo e.key:
// bật UniKey/Telex hay đổi layout thì e.code vẫn là 'KeyD', 'KeyJ'...
// kind: 'don' | 'ka' | 'bigdon' | 'bell'
export const PADS = new Map([
  ['KeyA', { id: 'bigdon-left', label: 'ドン大', key: 'A', kind: 'bigdon' }],
  ['KeyS', { id: 'ka-left', label: 'カッ', key: 'S', kind: 'ka' }],
  ['KeyD', { id: 'don-left', label: 'ドン', key: 'D', kind: 'don' }],
  ['KeyW', { id: 'bell', label: '鈴', key: 'W', kind: 'bell' }],
  ['KeyJ', { id: 'don-right', label: 'ドン', key: 'J', kind: 'don' }],
  ['KeyK', { id: 'ka-right', label: 'カッ', key: 'K', kind: 'ka' }],
  ['KeyL', { id: 'bigdon-right', label: 'ドン大', key: 'L', kind: 'bigdon' }],
]);

// Tra pad theo id (hook bàn phím trả về pad.id; nút bấm chuột cũng dùng id).
export const PADS_BY_ID = new Map(
  Array.from(PADS.values(), (pad) => [pad.id, pad]),
);
