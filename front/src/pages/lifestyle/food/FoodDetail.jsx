import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, createSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { addCalendarEvent } from '../../../components/widgets/calendar/calendarStore';
import authFetch from '../../../utils/authFetch';
import { useAuth } from '../../../auth/useAuth';

// 검색바/최근검색
import SearchBar from '../../../components/food/SearchBar';
import { loadRecents, pushRecent } from '../../../components/food/recentsApi';

const Page = (p) => (
  <section
    style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}
    {...p}
  />
);

// 드롭다운 -> 숫자 인분 매핑
const SERVING_OPTIONS = [
  { label: '0.5인분', value: 0.5 },
  { label: '1인분', value: 1.0 },
  { label: '1.5인분', value: 1.5 },
  { label: '2인분', value: 2.0 },
];

// 한글 -> 백엔드 enum(BRE/LUN/DIN)
const MEAL_CODE = { 아침: 'BRE', 점심: 'LUN', 저녁: 'DIN' };

export default function FoodDetail() {
  const { getEmpNo } = useAuth();
  const userId = getEmpNo() ? String(getEmpNo()) : '';
  const { foodName } = useParams();
  const navigate = useNavigate();

  const decodedName = useMemo(
    () => decodeURIComponent(foodName || ''),
    [foodName]
  );

  // 상세 데이터
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // 검색바/최근검색
  const [search, setSearch] = useState('');
  const [recents, setRecents] = useState([]);

  useEffect(() => {
    if (userId) loadRecents(userId).then(setRecents);
  }, [userId]);

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

    //  navigate는 마지막에 (DB 반영 후 이동)
    navigate({
      pathname: '/lifestyle/food/search',
      search: `?${createSearchParams({ q })}`,
    });
  };

  // 상세 API 호출
  useEffect(() => {
    let abort = false;

    async function load() {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await authFetch(
          `/api/foods/by-name?name=${encodeURIComponent(decodedName)}`
        );
        if (!res.ok) throw new Error('상세 조회에 실패했어요.');
        const data = await res.json();
        if (!abort) setDetail(data);
      } catch (e) {
        if (!abort) setErrorMsg(e.message || '상세 조회 중 오류가 발생했어요.');
      } finally {
        if (!abort) setLoading(false);
      }
    }

    if (decodedName) load();
    return () => {
      abort = true;
    };
  }, [decodedName]);

  // 화면에 표시할 영양 성분 포맷
  const nutrition = useMemo(() => {
    if (!detail) return [];
    return [
      {
        label: '칼로리',
        value: detail.kcal != null ? `${detail.kcal} kcal` : '-',
      },
      {
        label: '단백질',
        value: detail.protein != null ? `${detail.protein} g` : '-',
      },
      {
        label: '칼슘',
        value: detail.calcium != null ? `${detail.calcium} mg` : '-',
      },
      {
        label: '비타민(A)',
        value: detail.vitaminA != null ? `${detail.vitaminA} µg RAE` : '-',
      },
      {
        label: '비타민(B1)',
        value: detail.vitaminB1 != null ? `${detail.vitaminB1} mg` : '-',
      },
      {
        label: '비타민(B2)',
        value: detail.vitaminB2 != null ? `${detail.vitaminB2} mg` : '-',
      },
    ];
  }, [detail]);

  const servingLabel = detail?.servingDesc
    ? `*${detail.servingDesc}`
    : '*1회 제공량';

  // 날짜/선택값
  const [date, setDate] = useState(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  });
  const [mealType, setMealType] = useState('점심');
  const [serving, setServing] = useState(1.0); // ✅ 컴포넌트 내부에서만 선언 (중복 없음)

  const handleRegister = async () => {
    if (!detail) return;

    const empNo = getEmpNo();
    if (!empNo) {
      window.alert('로그인이 필요합니다.');
      return;
    }

    const mealTypeCode = MEAL_CODE[mealType] || 'LUN'; // ✅ 백엔드 값
    try {
      const res = await authFetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeNo: empNo,
          eatDate: date, // yyyy-MM-dd
          mealType: mealTypeCode, // 'BRE' | 'LUN' | 'DIN'
          items: [
            {
              foodNo: detail.foodNo,
              servings: serving, // 숫자
              memo: '',
            },
          ],
        }),
      });

      if (!res.ok) throw new Error('등록에 실패했습니다.');

      // 백엔드가 totalKcal을 내려주면 사용, 아니면 계산
      const saved = await res.json().catch(() => ({}));
      const backendKcal = Number(saved?.totalKcal);
      const kcalNumber = Number.isFinite(backendKcal)
        ? backendKcal
        : Number(detail.kcal || 0) * Number(serving || 1);

      window.alert('식사 등록 완료!');
    } catch (e) {
      console.error(e);
      window.alert(e.message || '등록 처리 중 오류가 발생했습니다.');
    }
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2,
              px: { xs: 0, md: 2 },
            }}
          >
            <Box sx={{ width: 300, maxWidth: '100%' }}>
              <SearchBar
                value={search}
                onChange={setSearch}
                onSearch={handleSearch}
                canSearch={search.trim().length > 0}
              />
            </Box>
          </Box>

          <Box sx={{ px: { xs: 0, md: 4 }, mb: 2 }}>
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', fontWeight: 700 }}
            >
              음식 검색 &gt; {detail.name}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, mt: 1, mb: 1 }}>
              {detail.name}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {servingLabel}
            </Typography>
          </Box>

          {/* 컨트롤 */}
          <Box sx={{ px: { xs: 0, md: 4 }, mt: 2, mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <TextField
                label="식사일"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 220 }}
              />
              <TextField
                label="식사 유형"
                select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                sx={{ width: 220 }}
              >
                {['아침', '점심', '저녁'].map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="인분"
                select
                value={serving}
                onChange={(e) => setServing(Number(e.target.value))}
                sx={{ width: 220 }}
              >
                {SERVING_OPTIONS.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="success"
                disableElevation
                sx={{ height: 40, px: 3, fontWeight: 700, borderRadius: 2 }}
                onClick={handleRegister}
              >
                캘린더에 등록
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 영양 성분 */}
          <Box
            sx={{
              px: { xs: 0, md: 4 },
              py: 2,
              borderRadius: 2,
              background: (t) =>
                t.palette.mode === 'light' ? '#EEF5FF' : t.palette.action.hover,
            }}
          >
            {nutrition.map((n) => (
              <Box
                key={n.label}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  py: 1.2,
                  borderBottom: (t) => `1px dashed ${t.palette.divider}`,
                  '&:last-of-type': { borderBottom: 'none' },
                }}
              >
                <span style={{ color: '#374151' }}>{n.label}</span>
                <span style={{ justifySelf: 'end', fontWeight: 600 }}>
                  {n.value}
                </span>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Page>
  );
}
