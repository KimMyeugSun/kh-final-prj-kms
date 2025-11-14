import React, { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { GUTTER, COL_LEFT_W } from '../../define/dashboardLayout';
import BannerCard from '../../components/dashboard/BannerCard';
import DailyGoalsCard from '../../components/dashboard/DailyGoalsCard';
import HospitalSearchCard from '../../components/dashboard/HospitalSearchCard';
import NoticeCard from '../../components/dashboard/NoticeCard';
import CalendarCard from '../../components/dashboard/CalendarCard';
import MealDayModal from '../../components/calendar/MealDayModal';
import WorkoutDayModal from '../../components/calendar/WorkoutDayModal';
import authFetch from '../../utils/authFetch';
import { AuthContext } from '../../auth/AuthContext';

const Page = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  minHeight: 'calc(100vh - var(--header-height))',
}));

const Canvas = styled('div')({
  width: '100%',
  display: 'flex',
  gap: GUTTER,
  flex: 1,
  minHeight: 0,
  alignItems: 'stretch',
});

export default function DashBoard() {
  const { getEmpNo } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [viewer, setViewer] = useState({ open: false, type: null, date: null });
  const [isSixWeekMonth, setIsSixWeekMonth] = useState(false);

  // 이벤트 로드
  const loadEvents = async (from, to) => {
    const empNo = getEmpNo();
    if (!empNo) return;

    const fmt = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;

    try {
      // 1️⃣ 캘린더 이벤트 불러오기
      const res = await authFetch(
        `/api/calendar/events?empNo=${empNo}&from=${fmt(from)}&to=${fmt(to)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // 2️⃣ 6주 달 감지
      const start = new Date(from);
      const end = new Date(to);
      const diffDays = (end - start) / (1000 * 60 * 60 * 24);
      setIsSixWeekMonth(diffDays > 35);

      // 3️⃣ 오늘 목표 상태 (done 여부)
      const todayKey = fmt(new Date());
      const goalsRes = await authFetch(
        `/api/daily-goals?empNo=${empNo}&date=${todayKey}`
      );
      const goalData = goalsRes.ok ? await goalsRes.json() : [];

      const isDone = (item, type) => {
        const g = goalData.find(
          (g) =>
            g.itemType === (type === 'workout' ? 'WORKOUT' : 'MEAL') &&
            g.itemText === item.text
        );
        return g ? g.done : false;
      };

      // 4️⃣ 이벤트 그룹화 (mealItems 포함 복원)
      const grouped = {};
      data.forEach((e) => {
        const key = `${e.date}-${e.type}`;
        if (!grouped[key]) {
          grouped[key] = {
            date: e.date,
            type: e.type,
            kcal: Number(e.kcal) || 0,
            items: (e.items || []).map((txt, idx) => ({
              id: `${e.type}-${idx}`,
              text: txt,
              done: isDone({ text: txt }, e.type),
            })),
            mealItems:
              e.type === 'meal'
                ? [
                    {
                      mealType: e.mealType, // 아침/점심/저녁
                      items: (e.items || []).map((txt, idx) => ({
                        id: `${e.type}-${idx}`,
                        text: txt,
                        done: isDone({ text: txt }, e.type),
                      })),
                    },
                  ]
                : [],
          };
        } else {
          grouped[key].kcal += Number(e.kcal) || 0;
          grouped[key].items.push(
            ...(e.items || []).map((txt, idx) => ({
              id: `${e.type}-${idx}`,
              text: txt,
              done: isDone({ text: txt }, e.type),
            }))
          );
          if (e.type === 'meal') {
            grouped[key].mealItems.push({
              mealType: e.mealType,
              items: (e.items || []).map((txt, idx) => ({
                id: `${e.type}-${idx}`,
                text: txt,
                done: isDone({ text: txt }, e.type),
              })),
            });
          }
        }
      });

      // 5️⃣ kcal이 0인 일정은 완전히 제거 (캘린더에서도 안 보이게)
      const mapped = Object.values(grouped)
        .filter((e) => e.kcal > 0)
        .map((e) => ({
          id: `${e.date}-${e.type}-${Math.round(e.kcal)}`,
          title: `${Math.round(e.kcal)}kcal`,
          start: new Date(e.date),
          end: new Date(e.date),
          allDay: true,
          type: e.type,
          kcal: e.kcal,
          items: e.items || [],
          mealItems: e.mealItems || [], // ✅ 식단용 구조 복원
        }));

      setEvents(mapped);
    } catch (err) {
      console.error('캘린더 이벤트 로딩 실패', err);
    }
  };

  useEffect(() => {
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    const to = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    loadEvents(from, to);
  }, []);

  const closeViewer = (refresh = false) => {
    setViewer({ open: false, type: null, date: null });
    if (refresh) {
      const today = new Date();
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      const to = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      loadEvents(from, to);
    }
  };

  return (
    <Page>
      <Canvas>
        {/* 왼쪽 컬럼 */}
        <Box
          sx={{
            width: `calc(${COL_LEFT_W}px - ${GUTTER}px)`,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minHeight: 0,
          }}
        >
          {/* 배너 고정 */}
          <Box sx={{ height: 600, minHeight: 600, flexShrink: 0 }}>
            <BannerCard />
          </Box>

          {/* 공지 */}
          <Box sx={{ height: 300, minHeight: 400 }}>
            <NoticeCard />
          </Box>
        </Box>

        {/* 오른쪽 컬럼 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* 캘린더 */}
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
            <CalendarCard
              grow
              events={events}
              onEdit={(evt) => {
                const t = (evt.type || '').toLowerCase();
                setViewer({ open: true, type: t, date: new Date(evt.start) });
              }}
              onRange={(start, end) => loadEvents(start, end)}
            />
          </Box>

          {/* 일일목표 + 병원찾기 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minHeight: 0,
            }}
          >
            <Box sx={{ flex: 6, minHeight: isSixWeekMonth ? 300 : 220 }}>
              <DailyGoalsCard events={events} />
            </Box>

            {/* <Box sx={{ flex: 4, minHeight: 180 }}>
              <HospitalSearchCard />
            </Box> */}
          </Box>
        </Box>
      </Canvas>

      {/* 모달 */}
      {viewer.open && viewer.type === 'meal' && (
        <MealDayModal
          open
          date={viewer.date}
          onClose={(refresh) => closeViewer(refresh)}
        />
      )}
      {viewer.open && viewer.type === 'workout' && (
        <WorkoutDayModal open date={viewer.date} onClose={closeViewer} />
      )}
    </Page>
  );
}
