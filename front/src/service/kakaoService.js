export async function searchPlaces(query) {
  const res = await fetch(
    `/api/public/kakao/places?query=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error('검색 실패');
  return res.json();
}
