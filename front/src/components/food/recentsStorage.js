// export const MAX_RECENTS = 5;

// // 유저별 키 생성
// function keyForUser(userId) {
//   return `food.search.recents:${userId || 'guest'}`;
// }

// export function loadRecents(userId) {
//   try {
//     const raw = localStorage.getItem(keyForUser(userId));
//     const arr = JSON.parse(raw || '[]');
//     return Array.isArray(arr) ? arr : [];
//   } catch {
//     return [];
//   }
// }

// export function saveRecents(userId, items) {
//   try {
//     localStorage.setItem(keyForUser(userId), JSON.stringify(items));
//   } catch {}
// }

// export function pushRecent(userId, items, word) {
//   const w = String(word || '').trim();
//   if (!w) return items || [];
//   const base = Array.isArray(items) ? items : [];
//   const next = [w, ...base.filter((x) => x !== w)].slice(0, MAX_RECENTS);
//   saveRecents(userId, next);
//   return next;
// }
