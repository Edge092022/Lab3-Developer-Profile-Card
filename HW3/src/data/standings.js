// PubgVnSquadStanding: { id, name, wwcd, placementPts, killPts }
// id: 'te' | 'ces' | 'ge' | 'agg' | 'roy'. Điểm số tự đặt.
// Tổng điểm (placementPts + killPts) tính trong render, không lưu ở đây.
//
// Các trường hợp bằng điểm để thử tiêu chí phụ:
// - Tổng 130: te và ces -> ces đứng trên vì Kill cao hơn (75 > 70).
// - Tổng 122: ge, agg, roy -> agg và roy cùng Kill 72 nên xếp theo tên (AGG trước Roy), ge cuối vì Kill 64.
export const STANDINGS = [
  { id: 'te', name: 'The Expendables', wwcd: 3, placementPts: 60, killPts: 70 },
  { id: 'ces', name: 'Cerberus Esports', wwcd: 2, placementPts: 55, killPts: 75 },
  { id: 'ge', name: 'Genius Esports', wwcd: 2, placementPts: 58, killPts: 64 },
  { id: 'agg', name: 'AGG', wwcd: 1, placementPts: 50, killPts: 72 },
  { id: 'roy', name: 'Roy Esports', wwcd: 1, placementPts: 50, killPts: 72 },
];
