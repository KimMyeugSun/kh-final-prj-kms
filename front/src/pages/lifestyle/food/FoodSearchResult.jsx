import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import SectionCard from '../../../components/food/SectionCard';
import SearchBar from '../../../components/food/SearchBar';
import RecentChips from '../../../components/food/RecentChips';
import FoodList from '../../../components/food/FoodList';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { loadRecents, pushRecent } from '../../../components/food/recentsApi';
import authFetch from '../../../utils/authFetch';
import { AuthContext } from '../../../auth/AuthContext';

const Page = (props) => (
  <section
    style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}
    {...props}
  />
);
const Center = (props) => (
  <div style={{ width: 760, margin: '0 auto' }} {...props} />
);

export default function FoodSearchResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getEmpNo } = useContext(AuthContext);
  const userId = getEmpNo() ? String(getEmpNo()) : '';

  const [keyword, setKeyword] = useState('');
  const [displayQuery, setDisplayQuery] = useState('');
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [recents, setRecents] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const fetchResults = async (q, page = 0, size = 3) => {
    const res = await authFetch(
      `/api/foods?q=${encodeURIComponent(q)}&page=${page}&size=${size}`
    );
    if (!res.ok) throw new Error('검색 실패');
    const data = await res.json();
    setResults(data.content || []);
    setTotal(data.totalElements ?? (data.content?.length || 0));
    setDisplayQuery(q);
    setShowAll(false);
  };

  useEffect(() => {
    const q = searchParams.get('query') || searchParams.get('q') || '';
    if (userId) loadRecents(userId).then(setRecents);
    if (q) {
      setKeyword(q);
      fetchResults(q);
    }
  }, [searchParams, userId]);

  const canSearch = useMemo(() => keyword.trim().length > 0, [keyword]);

  const handleSearch = async () => {
    const q = keyword.trim();
    if (!q || !userId) return;

    try {
      await pushRecent(userId, q); // DB 저장
      const rec = await loadRecents(userId); // 최신화
      setRecents(rec);
      await fetchResults(q);
    } catch (e) {
      console.error('검색 오류', e);
      await fetchResults(q);
    }
  };

  const visibleItems = useMemo(
    () => (showAll ? results : results.slice(0, 3)),
    [results, showAll]
  );

  const handleShowAll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (results.length >= total) {
      setShowAll(true);
      return;
    }
    const size = Math.min(total || 1000, 1000);
    await fetchResults(displayQuery, 0, size);
    setShowAll(true);
  };

  return (
    <Page>
      <Center>
        <div
          style={{
            marginTop: 30,
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <h2 style={{ width: 760, margin: 0, fontSize: 28, fontWeight: 800 }}>
            <em
              style={{ fontStyle: 'normal', color: '#7C3AED', fontWeight: 900 }}
            >
              ‘{displayQuery}’
            </em>
            에 대한 음식 검색 결과&nbsp;
            <em
              style={{ fontStyle: 'normal', color: '#7C3AED', fontWeight: 900 }}
            >
              {total}
            </em>
            건
          </h2>
        </div>

        <div style={{ margin: '12px 0 8px' }}>
          <SearchBar
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
            canSearch={canSearch}
          />
        </div>

        <RecentChips
          items={Array.isArray(recents) ? recents : []}
          onSelect={async (w) => {
            setKeyword(w);
            await pushRecent(userId, w);
            const rec = await loadRecents(userId);
            setRecents(rec);
            fetchResults(w);
          }}
        />
      </Center>

      <SectionCard title="검색 결과">
        {results.length > 0 ? (
          <FoodList
            items={visibleItems.map((r) => ({
              name: r.name,
              serving: r.servingDesc || r.serving || '',
              kcal: r.kcal ?? 0,
            }))}
            onItemClick={(name) =>
              navigate(`/lifestyle/food/${encodeURIComponent(name)}`)
            }
          />
        ) : (
          <div
            style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0' }}
          >
            검색 결과가 없습니다. 검색어를 입력해 주세요.
          </div>
        )}

        {!showAll && total > 3 && (
          <Box sx={{ maxWidth: 520, mx: 'auto', mt: 2.75, mb: 0.75 }}>
            <Button
              fullWidth
              variant="contained"
              disableElevation
              type="button"
              component="button"
              sx={{
                height: 44,
                borderRadius: 999,
                fontWeight: 700,
                letterSpacing: '-0.2px',
              }}
              onClick={handleShowAll}
            >
              전체보기 ({total}개 모두 보기)
            </Button>
          </Box>
        )}
      </SectionCard>
    </Page>
  );
}
