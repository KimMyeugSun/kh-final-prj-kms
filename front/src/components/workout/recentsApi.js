import authFetch from '../../utils/authFetch';

export const MAX_RECENTS = 5;

/** 운동 최근 검색어 조회 */
export async function loadRecents(userId) {
  if (!userId) return [];
  try {
    const res = await authFetch(`/api/lfsearch/${userId}/EXERCISE`);
    if (!res.ok) throw new Error('최근 검색어 조회 실패');
    const data = await res.json();
    const keywords = (data || []).map((r) => r.keyword);
    const unique = [...new Set(keywords)];
    return unique.slice(0, MAX_RECENTS);
  } catch (e) {
    console.error(e);
    return [];
  }
}

/** 운동 검색어 저장 */
export async function pushRecent(userId, keyword) {
  if (!userId || !keyword) return null;
  try {
    await authFetch(`/api/lfsearch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeNo: userId,
        domainCode: 'EXERCISE',
        keyword,
      }),
    });
  } catch (e) {
    console.error('검색어 저장 실패', e);
  }
}
