import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SectionCard from '../../../components/food/SectionCard';
import SearchBar from '../../../components/food/SearchBar';
import RecentChips from '../../../components/food/RecentChips';
import FoodList from '../../../components/food/FoodList';
import { loadRecents, pushRecent } from '../../../components/food/recentsApi';
import { AuthContext } from '../../../auth/AuthContext';

const TOP3_MOCK = [
  { name: '옥수수샐러드', serving: '1인분 (200g)', kcal: 158.8 },
  { name: '양배추샐러드', serving: '1인분 (150g)', kcal: 117.5 },
  { name: '참치샐러드', serving: '1인분 (150g)', kcal: 165.8 },
];

export default function FoodMain() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getEmpNo } = useContext(AuthContext);
  const userId = String(getEmpNo() ?? '');

  const [keyword, setKeyword] = useState('');
  const [recents, setRecents] = useState([]);

  useEffect(() => {
    if (!userId) return;
    loadRecents(userId).then(setRecents);
    const q = searchParams.get('query') || searchParams.get('q') || '';
    if (q) setKeyword(q);
  }, [searchParams, userId]);

  const canSearch = useMemo(() => keyword.trim().length > 0, [keyword]);

  const goResult = (q) => {
    navigate(`/lifestyle/food/search?query=${encodeURIComponent(q)}`);
  };

  // ✅ DB 기반으로만 관리
  const handleSearch = async () => {
    const q = keyword.trim();
    if (!q || !userId) return;

    try {
      await pushRecent(userId, q); // 서버에 저장 완료까지 기다림
      const rec = await loadRecents(userId); // 최신 DB 값 다시 반영
      setRecents(rec);
      goResult(q);
    } catch (e) {
      console.error('검색 실패', e);
      goResult(q); // 실패 시에도 검색은 진행
    }
  };

  const goDetail = (name) => {
    navigate(`/lifestyle/food/${encodeURIComponent(name)}`);
  };

  return (
    <section
      style={{
        maxWidth: 1200,
        margin: '40px auto',
        padding: '0 20px',
        userSelect: 'none',
      }}
    >
      <div style={{ width: 760, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: 36 }}>
          <span style={{ color: '#2D7DF6' }}>어떤 음식</span>을 찾으나요?
        </h2>

        <div style={{ margin: '18px 0 8px' }}>
          <SearchBar
            placeholder="음식명을 검색해주세요"
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
            canSearch={canSearch}
            sx={{
              '& input': {
                textAlign: 'center',
                transform: 'translateX(27px)',
              },
              '& input::placeholder': {
                textAlign: 'center',
                opacity: 0.9,
              },
            }}
          />
        </div>

        <RecentChips
          items={Array.isArray(recents) ? recents : []}
          onSelect={async (w) => {
            setKeyword(w);
            await pushRecent(userId, w);
            const rec = await loadRecents(userId);
            setRecents(rec);
            goResult(w);
          }}
        />
      </div>

      <SectionCard title="다이어터에게 추천하는 음식 TOP 3">
        <FoodList items={TOP3_MOCK} onItemClick={goDetail} />
      </SectionCard>
    </section>
  );
}
