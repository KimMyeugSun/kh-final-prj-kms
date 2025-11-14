import React, { useEffect, useMemo, useState, useContext } from 'react';
import {
  useParams,
  useNavigate,
  createSearchParams,
  useLocation,
} from 'react-router-dom';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';

import WorkoutAddModal from '../../../components/workout/WorkoutAddModal';
import SearchBar from '../../../components/workout/SearchBar';
import {
  loadRecents,
  pushRecent,
} from '../../../components/workout/recentsApi';
import authFetch from '../../../utils/authFetch';
import { AuthContext } from '../../../auth/AuthContext';

// 레이아웃 래퍼
const Page = (p) => (
  <section
    style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}
    {...p}
  />
);

// 미리보기/표시용 계산
const DEFAULT_WEIGHT_KG = 60;
const calcKcal = (eph, weightKg, minutes) => {
  const n =
    Number(eph || 0) * Number(weightKg || 0) * (Number(minutes || 0) / 60);
  return Number.isFinite(n) ? Math.round(n) : 0;
};

export default function WorkoutDetail() {
  const { workoutName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getEmpNo } = useContext(AuthContext);
  const userId = getEmpNo() ? String(getEmpNo()) : '';

  const decodedName = useMemo(
    () => decodeURIComponent(workoutName || ''),
    [workoutName]
  );

  const categoryFromState = location.state?.category || null;
  const categoryFromQuery = new URLSearchParams(location.search).get(
    'category'
  );
  const initialCategory = categoryFromState || categoryFromQuery || null;

  // 상세 데이터
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [detail, setDetail] = useState(null); // { id, name, eph, typeCode, typeName, memo }
  const [similar, setSimilar] = useState([]); // [{ name, kcal }]

  // 검색바/최근검색
  const [search, setSearch] = useState('');
  const [recents, setRecents] = useState([]);
  useEffect(() => {
    if (userId) loadRecents(userId).then(setRecents);
  }, [userId]);

  // 모달
  const [openAdd, setOpenAdd] = useState(false);

  // 체중(임시 60kg 고정)
  const [weightKg] = useState(DEFAULT_WEIGHT_KG);

  // 상세 API 호출
  useEffect(() => {
    let abort = false;

    const load = async () => {
      setLoading(true);
      setErrorMsg('');
      setDetail(null);
      setSimilar([]);

      try {
        // 1) 이름으로 검색 → exerciseNo 찾기
        const searchUrl = `/api/exercises?${createSearchParams({
          q: decodedName,
          page: '0',
          size: '1',
        })}`;
        const searchRes = await authFetch(searchUrl);
        if (!searchRes.ok) throw new Error('운동 검색에 실패했어요.');

        const searchData = await searchRes.json();
        const row = searchData?.content?.[0];
        if (!row) throw new Error('해당 이름의 운동을 찾을 수 없어요.');

        // 2) 단건 조회 API 호출 (memo 포함됨)
        const detailRes = await authFetch(`/api/exercises/${row.exerciseNo}`);
        if (!detailRes.ok) throw new Error('운동 상세 조회에 실패했어요.');
        const entity = await detailRes.json();

        const d = {
          id: entity.exerciseNo,
          name: entity.exerciseName,
          eph: entity.energyPerKgHr,
          typeCode: entity?.type?.typeCode ?? null,
          typeName: entity?.type?.typeName ?? initialCategory ?? '운동',
          memo: entity.memo,
        };

        if (!abort) setDetail(d);

        // 같은 분류에서 유사 운동 불러오기
        if (!abort && (d.typeCode || initialCategory)) {
          const simParams = d.typeCode
            ? { type: d.typeCode, page: '0', size: '50' }
            : { q: '', page: '0', size: '50' };

          const simUrl = `/api/exercises?${createSearchParams(simParams)}`;
          const simRes = await authFetch(simUrl);

          if (simRes.ok) {
            const simData = await simRes.json();
            const pool = (simData?.content || []).filter(
              (x) => x.exerciseNo !== d.id
            );

            const scored = pool
              .map((x) => {
                const met = Number(x.energyPerKgHr || 0);
                const kcal60 =
                  x.previewKcal != null
                    ? Math.round(Number(x.previewKcal))
                    : calcKcal(met, weightKg, 60);
                return {
                  name: x.exerciseName,
                  kcal: kcal60,
                  diff: Math.abs(met - Number(d.eph || 0)),
                };
              })
              .sort((a, b) =>
                a.diff === b.diff ? a.kcal - b.kcal : a.diff - b.diff
              )
              .slice(0, 3);

            if (!abort) setSimilar(scored);
          }
        }
      } catch (e) {
        if (!abort) {
          console.error(e);
          setErrorMsg(e.message || '상세 조회 중 오류가 발생했어요.');
        }
      } finally {
        if (!abort) setLoading(false);
      }
    };

    if (decodedName) load();
    return () => {
      abort = true;
    };
  }, [decodedName, weightKg, initialCategory]);

  // 30, 60분 운동 칼로리
  const kcal30 = useMemo(
    () => (detail ? calcKcal(detail.eph, weightKg, 30) : 0),
    [detail, weightKg]
  );
  const kcal60 = useMemo(
    () => (detail ? calcKcal(detail.eph, weightKg, 60) : 0),
    [detail, weightKg]
  );

  // 검색 실행
  const handleSearch = async () => {
    const q = search.trim();
    if (!q) return;

    if (userId) {
      try {
        await pushRecent(userId, q);

        const rec = await loadRecents(userId);
        setRecents(rec);
      } catch (e) {
        console.error('검색어 저장 실패', e);
      }
    }

    navigate({
      pathname: '/lifestyle/workout/search',
      search: `?${createSearchParams({ q })}`,
    });
  };

  // 비슷한 운동 상세로 이동
  const goDetail = (name) => {
    navigate(`/lifestyle/workout/${encodeURIComponent(name)}`, {
      state: { category: detail?.typeName || '운동' },
    });
  };

  return (
    <Page>
      {loading && (
        <div style={{ textAlign: 'center', padding: 24 }}>불러오는 중…</div>
      )}

      {!loading && errorMsg && (
        <div style={{ textAlign: 'center', padding: 24, color: '#ef4444' }}>
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && detail && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: (t) => `1px solid ${t.palette.divider}`,
            background: (t) => t.palette.background.default,
          }}
        >
          {/* 검색바 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ width: 300, maxWidth: '100%' }}>
              <SearchBar
                value={search}
                onChange={setSearch}
                onSearch={handleSearch}
                canSearch={search.trim().length > 0}
              />
            </Box>
          </Box>

          {/* 제목 */}
          <Box sx={{ px: { xs: 0, md: 4 }, mb: 2 }}>
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', fontWeight: 700 }}
            >
              {detail.typeName || '운동'} &gt; {decodedName}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, mt: 1, mb: 1 }}>
              {detail.name}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
              *{weightKg}kg 기준 · 단위체중당 시간당 에너지 소비량(MET) -{' '}
              {detail.eph}
            </Typography>
            {detail.memo && (
              <Typography
                sx={{ mt: 1, color: 'text.secondary', fontWeight: 800 }}
              >
                운동 팁 : {detail.memo}
              </Typography>
            )}
          </Box>

          {/* 선택/추가 영역 */}
          <Box sx={{ px: { xs: 0, md: 4 }, mt: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="success"
                disableElevation
                sx={{ height: 40, px: 3, fontWeight: 700, borderRadius: 2 }}
                onClick={() => setOpenAdd(true)}
              >
                캘린더에 추가하기
              </Button>
              <WorkoutAddModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                defaultName={detail.name}
                defaultEph={detail.eph}
                lockExercise
              />
            </Box>
          </Box>

          {/* 소모 칼로리 표 */}
          <Box sx={{ px: { xs: 0, md: 4 }, mt: 4, mb: 5 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: '#2D7DF6' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 800 }}>
                    운동시간
                  </TableCell>
                  <TableCell
                    sx={{ color: '#fff', fontWeight: 800 }}
                    align="right"
                  >
                    소모 칼로리
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>30분</TableCell>
                  <TableCell align="right">{kcal30}kcal</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>1시간</TableCell>
                  <TableCell align="right">{kcal60}kcal</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              ※ 계산식: 체중(kg) × MET(=kcal/kg/hr) × 시간(시간)
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 비슷한 운동 */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 750, mb: 2, textAlign: 'center' }}
            >
              {detail.name}와 비슷한 다른 운동
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
              }}
            >
              {similar.map((ex) => (
                <Paper
                  key={ex.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => goDetail(ex.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') goDetail(ex.name);
                  }}
                  sx={{
                    width: '60%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'transform 120ms ease, box-shadow 120ms ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{ex.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      *1시간
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 700, lineHeight: 3 }}>
                    {ex.kcal}kcal
                  </Typography>
                </Paper>
              ))}

              {!similar.length && (
                <Typography sx={{ color: 'text.secondary' }}>
                  비슷한 운동이 없습니다.
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>
      )}
    </Page>
  );
}
