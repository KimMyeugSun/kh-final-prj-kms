import React, { useEffect, useMemo, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';

import SearchBar from '../../../components/workout/SearchBar';
import RecentChips from '../../../components/workout/RecentChips';
import CategoryTabs from '../../../components/workout/CategoryTabs';
import SectionTitle from '../../../components/workout/SectionTitle';
import WorkoutGrid from '../../../components/workout/WorkoutGrid';
import WorkoutAddModal from '../../../components/workout/WorkoutAddModal';

import {
  loadRecents,
  pushRecent,
} from '../../../components/workout/recentsApi';
import authFetch from '../../../utils/authFetch';
import { AuthContext } from '../../../auth/AuthContext';

/* ===== Layout ===== */
const Page = styled('section')({
  maxWidth: 1200,
  margin: '40px auto',
  padding: '0 20px',
  userSelect: 'none',
});
const Center = styled('div')({ width: 760, margin: '0 auto' });

/* ===== CTA 버튼 ===== */
const CTA_BLUE = '#2D7DF6',
  CTA_BLUE_HOVER = '#1E6EEB',
  CTA_BLUE_ACTIVE = '#195ED3';
const Cta = styled('button')({
  width: 520,
  height: 44,
  display: 'block',
  margin: '22px auto 6px',
  borderRadius: 999,
  border: 'none',
  background: CTA_BLUE,
  color: '#fff',
  fontWeight: 700,
  letterSpacing: '-0.2px',
  cursor: 'pointer',
  transition:
    'transform .1s ease, box-shadow .15s ease, background-color .15s ease',
  '&:hover': { background: CTA_BLUE_HOVER },
  '&:active': { background: CTA_BLUE_ACTIVE, transform: 'translateY(2px)' },
  '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
});

const TAB_TO_TYPE = {
  유산소: 'CARDIO',
  근력운동: 'STRENGTH',
  스포츠: 'SPORTS',
  '필라테스·체조': 'PILATES',
  그외: 'OTHER',
};
const CATES = Object.keys(TAB_TO_TYPE);
const INITIAL_COUNT = 10;

export default function WorkoutMain() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getEmpNo } = useContext(AuthContext);
  const userId = getEmpNo() ? String(getEmpNo()) : '';

  const [tab, setTab] = useState(CATES[0]);
  const [keyword, setKeyword] = useState('');
  const [recents, setRecents] = useState([]);

  const [itemsByTab, setItemsByTab] = useState({});
  const [totalByTab, setTotalByTab] = useState({});
  const [loadingByTab, setLoadingByTab] = useState({});
  const [errorByTab, setErrorByTab] = useState({});
  const [expandedTabs, setExpandedTabs] = useState({});
  const [reqIdByTab, setReqIdByTab] = useState({});

  useEffect(() => {
    if (userId) {
      loadRecents(userId).then(setRecents);
    }
    const q = searchParams.get('query') || searchParams.get('q') || '';
    if (q) setKeyword(q);
  }, [searchParams, userId]);

  const canSearch = useMemo(() => keyword.trim().length > 0, [keyword]);

  const saveRecent = (q) => {
    if (!userId) return;
    pushRecent(userId, q).then(() => {
      loadRecents(userId).then(setRecents);
    });
  };

  const goResult = (q) => {
    const typeCode = TAB_TO_TYPE[tab] || '';
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (typeCode) params.set('type', typeCode);
    navigate(`/lifestyle/workout/search?${params.toString()}`);
  };

  const goDetail = (name) =>
    navigate(`/lifestyle/workout/${encodeURIComponent(name)}`, {
      state: { category: tab, typeCode: TAB_TO_TYPE[tab] || null },
    });

  const doSearch = async (q) => {
    const w = q.trim();
    if (!w) return;

    if (userId) {
      await pushRecent(userId, w);
    }

    goResult(w);
  };

  const handleSearch = () => doSearch(keyword);

  useEffect(() => {
    setExpandedTabs((prev) => ({ ...prev, [tab]: false }));
    if (!itemsByTab[tab] || itemsByTab[tab].length === 0) {
      fetchTabItems(tab, false);
    }
  }, [tab]);

  const fetchTabItems = async (tabName, wantAll) => {
    const typeCode = TAB_TO_TYPE[tabName];
    if (!typeCode) return;

    const nextId = (reqIdByTab[tabName] || 0) + 1;
    setReqIdByTab((p) => ({ ...p, [tabName]: nextId }));

    setLoadingByTab((p) => ({ ...p, [tabName]: true }));
    setErrorByTab((p) => ({ ...p, [tabName]: '' }));

    try {
      const knownTotal = totalByTab[tabName];
      const size =
        wantAll && knownTotal ? String(knownTotal) : String(INITIAL_COUNT);

      const res = await authFetch(
        `/api/exercises?type=${encodeURIComponent(
          typeCode
        )}&page=0&size=${size}`
      );
      if (!res.ok) throw new Error('운동 목록을 불러오지 못했습니다.');
      const data = await res.json();

      setReqIdByTab((curr) => {
        const isStale = (curr[tabName] || 0) !== nextId;
        if (isStale) return curr;
        setItemsByTab((p) => ({
          ...p,
          [tabName]: (data?.content || []).map((r) => r.exerciseName),
        }));
        setTotalByTab((p) => ({
          ...p,
          [tabName]: data?.totalElements ?? (data?.content || []).length,
        }));
        setLoadingByTab((p) => ({ ...p, [tabName]: false }));
        return curr;
      });
    } catch (e) {
      setReqIdByTab((curr) => {
        if ((curr[tabName] || 0) !== nextId) return curr;
        setErrorByTab((p) => ({
          ...p,
          [tabName]: e.message || '목록 조회 중 오류가 발생했습니다.',
        }));
        setItemsByTab((p) => ({ ...p, [tabName]: [] }));
        setTotalByTab((p) => ({ ...p, [tabName]: 0 }));
        setLoadingByTab((p) => ({ ...p, [tabName]: false }));
        return curr;
      });
    }
  };

  // 첫 로그인 시 모든 카테고리 프리패치
  useEffect(() => {
    let cancelled = false;
    async function prefetchAll() {
      for (const cate of CATES) {
        if (!itemsByTab[cate]) {
          await fetchTabItems(cate, false);
        }
        if (cancelled) break;
      }
    }
    prefetchAll();
    return () => {
      cancelled = true;
    };
  }, []); // 처음에만 실행

  const isExpanded = !!expandedTabs[tab];
  const all = itemsByTab[tab] || [];
  const total = totalByTab[tab] ?? 0;
  const busy = !!loadingByTab[tab];
  const err = errorByTab[tab];

  const visible = useMemo(
    () => (isExpanded ? all : all.slice(0, INITIAL_COUNT)),
    [all, isExpanded]
  );

  const toggleExpand = async () => {
    const next = !isExpanded;
    setExpandedTabs((p) => ({ ...p, [tab]: next }));
    if (next) {
      if (all.length < total) {
        await fetchTabItems(tab, true);
      }
    }
  };

  const [openRoutineUseModal, setOpenRoutineUseModal] = useState(false);

  return (
    <Page>
      <Center>
        <SectionTitle>
          <span style={{ color: '#2D7DF6' }}>어떤 운동</span>이 궁금하신가요?
        </SectionTitle>

        <div style={{ margin: '18px 0 8px' }}>
          <SearchBar
            placeholder="운동명을 검색해주세요"
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

        {/* 🔹 최근 검색어 (독립 영역) */}
        <RecentChips
          items={Array.isArray(recents) ? recents : []}
          onSelect={(w) => {
            setKeyword(w);
            goResult(w);
          }}
        />
      </Center>

      {/* 🔹 기존 루틴 등록 텍스트 */}
      <div
        style={{
          position: 'relative', // 부모 기준 배치
          maxWidth: 1160,
          margin: '0 auto',
        }}
      >
        <span
          onClick={() => setOpenRoutineUseModal(true)}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 13, // 🔸 카테고리 영역 바로 위에 살짝 겹치듯 위치
            fontSize: 14,
            color: '#2D7DF6',
            fontWeight: 600,
            cursor: 'pointer',
            userSelect: 'none',
            display: 'inline-block', // 🔸 블록 전체 차지 X
            background: 'transparent',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
            e.currentTarget.style.color = '#1E6EEB';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.textDecoration = 'none';
            e.currentTarget.style.color = '#2D7DF6';
          }}
        >
          💪 기존에 저장한 루틴 등록
        </span>
      </div>

      {/* 🔹 카테고리 박스 */}
      <div
        style={{
          width: '100%',
          maxWidth: 1160,
          margin: '8px auto 0',
          background: '#FAF6EE',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 24,
        }}
      >
        <CategoryTabs value={tab} onChange={setTab} categories={CATES} />

        {err && (
          <div style={{ textAlign: 'center', color: '#ef4444', padding: 24 }}>
            {err}
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <WorkoutGrid
            key={`${tab}-${isExpanded ? 'all' : 'top'}`}
            items={visible}
            onSelect={(name) => goDetail(name)}
          />
          {busy && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255,255,255,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                color: '#6b7280',
              }}
            >
              불러오는 중…
            </div>
          )}
        </div>

        {total > INITIAL_COUNT && (
          <Cta onClick={toggleExpand}>
            {isExpanded
              ? `${tab} 간단히 보기`
              : `전체보기 (${total}개 모두 보기)`}
          </Cta>
        )}
      </div>

      <WorkoutAddModal
        open={openRoutineUseModal}
        onClose={() => setOpenRoutineUseModal(false)}
        simpleRoutineMode={true}
      />
    </Page>
  );
}
