import React, { useEffect, useMemo, useState, useContext } from 'react';
import {
  useSearchParams,
  useNavigate,
  createSearchParams,
} from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import SearchBar from '../../../components/workout/SearchBar';
import RecentChips from '../../../components/workout/RecentChips';
import SectionCard from '../../../components/workout/SectionCard';
import ResultList from '../../../components/workout/ResultList';

import authFetch from '../../../utils/authFetch';
import {
  loadRecents,
  pushRecent,
  MAX_RECENTS,
} from '../../../components/workout/recentsApi';
import { AuthContext } from '../../../auth/AuthContext';

const Page = (p) => (
  <section
    style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}
    {...p}
  />
);
const Center = (p) => <div style={{ width: 760, margin: '0 auto' }} {...p} />;

const DEFAULT_WEIGHT_KG = 60;
const DEFAULT_MINUTES = 60;

const calcPreview = (
  eph,
  weightKg = DEFAULT_WEIGHT_KG,
  minutes = DEFAULT_MINUTES
) => {
  const n =
    Number(eph || 0) * Number(weightKg || 0) * (Number(minutes || 0) / 60);
  return Number.isFinite(n) ? Math.round(n) : 0;
};

const PREVIEW_SIZE = 3;
const FULL_SIZE = 50;

export default function WorkoutSearchResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getEmpNo } = useContext(AuthContext);
  const userId = getEmpNo() ? String(getEmpNo()) : '';

  const [keyword, setKeyword] = useState('');
  const [displayQuery, setDisplayQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recents, setRecents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const q = searchParams.get('query') || searchParams.get('q') || '';

    // 서버에서만 조회
    if (userId) {
      loadRecents(userId).then(setRecents);
    }

    if (q) {
      setKeyword(q);
      runSearch(q, true);
    }
  }, [searchParams, userId]);

  const canSearch = useMemo(() => keyword.trim().length > 0, [keyword]);

  const fetchResults = async (q, size) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const url = `/api/exercises?${createSearchParams({
        q,
        weightKg: String(DEFAULT_WEIGHT_KG),
        minutes: String(DEFAULT_MINUTES),
        page: '0',
        size: String(size),
      })}`;

      const res = await authFetch(url);
      if (!res.ok) throw new Error('운동 검색에 실패했어요.');
      const data = await res.json();

      setTotal(Number(data?.totalElements ?? 0));

      const items = (data?.content || []).map((row) => {
        const kcal =
          row?.previewKcal != null
            ? Math.round(Number(row.previewKcal))
            : calcPreview(row?.energyPerKgHr);

        return {
          name: row.exerciseName,
          sub: '*1시간',
          kcal,
          raw: row,
          categoryName: row?.type?.typeName ?? row?.typeName ?? '',
          typeCode: row?.type?.typeCode ?? row?.typeCode ?? '',
        };
      });

      setResults(items);
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message || '검색 중 오류가 발생했어요.');
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const runSearch = async (q, previewOnly = true) => {
    const w = q.trim();
    if (!w) return;

    setDisplayQuery(w);
    setShowAll(!previewOnly);

    if (userId) {
      await pushRecent(userId, w);
      loadRecents(userId).then(setRecents);
    }

    fetchResults(w, previewOnly ? PREVIEW_SIZE : FULL_SIZE);
  };

  const handleSearch = () => runSearch(keyword, true);

  const canToggle =
    !loading && !errorMsg && displayQuery && total > PREVIEW_SIZE;

  const toggleAll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !showAll;
    setShowAll(next);
    await fetchResults(displayQuery, next ? FULL_SIZE : PREVIEW_SIZE);
  };

  const handleShowAll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAll(true);
    await fetchResults(displayQuery, FULL_SIZE);
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
            에 대한 운동 검색 결과&nbsp;
            <em
              style={{ fontStyle: 'normal', color: '#7C3AED', fontWeight: 900 }}
            >
              {loading ? '…' : total}
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
          onSelect={(w) => {
            setKeyword(w);
            runSearch(w, true);
          }}
        />
      </Center>

      <SectionCard title="검색 결과">
        {loading && (
          <div
            style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0' }}
          >
            불러오는 중…
          </div>
        )}

        {!loading && errorMsg && (
          <div
            style={{ textAlign: 'center', color: '#ef4444', padding: '32px 0' }}
          >
            {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && (results?.length ?? 0) > 0 && (
          <ResultList
            items={results}
            onItemClick={(name) =>
              navigate(`/lifestyle/workout/${encodeURIComponent(name)}`)
            }
          />
        )}

        {!loading && !errorMsg && (results?.length ?? 0) === 0 && (
          <div
            style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0' }}
          >
            검색 결과가 없습니다. 다른 검색어를 입력해 주세요.
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
