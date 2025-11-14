import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Chip from '@mui/material/Chip';
import authFetch from '../../utils/authFetch';
import { useAuth } from '../../auth/useAuth';
import { BarChart } from '@mui/x-charts/BarChart';
import { Divider } from '@mui/material';

function ColumnCard({ title, laneId, lane, onToggle }) {
  const total = lane.items.length;
  const done = lane.items.filter((i) => i.done).length;

  return (
    <Paper
      sx={{
        flex: 1,
        minWidth: 260,
        borderRadius: 2,
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          background: '#2D7DF6',
          color: '#fff',
          px: 2,
          py: 1,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
        <Chip
          size="small"
          label={`${done}/${total}`}
          sx={{
            background: 'rgba(255,255,255,.25)',
            color: '#fff',
            fontWeight: 600,
          }}
        />
      </Box>

      <Box
        sx={{
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minHeight: 120,
          pb: 1,
        }}
      >
        {lane.items.length === 0 && (
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
            항목 없음
          </Typography>
        )}
        {lane.items.map((it) => (
          <Paper
            key={it.id}
            sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => onToggle(laneId, it.id)}
                sx={{ color: it.done ? '#22c55e' : '#9ca3af' }}
              >
                {it.done ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
              </IconButton>
              <Typography
                sx={{
                  fontWeight: 600,
                  flex: 1,
                  textDecoration: it.done ? 'line-through' : 'none',
                }}
              >
                {it.text}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}

export default function Daily() {
  const { getEmpNo } = useAuth();
  const empNo = getEmpNo();

  const [lanes, setLanes] = useState({
    aerobics: [],
    strength: { title: '운동', items: [] },
    'meal-am': { title: '식단-아침', items: [] },
    'meal-lunch': { title: '식단-점심', items: [] },
    'meal-dinner': { title: '식단-저녁', items: [] },
  });

  const [mealData, setMealData] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);

  const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getWeekEnd = (date) => {
    const d = getWeekStart(date);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  useEffect(() => {
    if (!empNo) return;

    const fetchToday = async () => {
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10);

      const goalRes = await authFetch(
        `/api/daily-goals?empNo=${empNo}&date=${dateStr}`
      );
      const goalData = goalRes.ok ? await goalRes.json() : [];

      const mealRes = await authFetch(
        `/api/calendar/meals/detail?empNo=${empNo}&date=${dateStr}`
      );
      const mealData = mealRes.ok ? await mealRes.json() : null;

      const workoutRes = await authFetch(
        `/api/calendar/workouts/detail?empNo=${empNo}&date=${dateStr}`
      );
      const workoutData = workoutRes.ok ? await workoutRes.json() : null;

      const base = {
        aerobics: [],
        strength: { title: '운동', items: [] },
        'meal-am': { title: '식단-아침', items: [] },
        'meal-lunch': { title: '식단-점심', items: [] },
        'meal-dinner': { title: '식단-저녁', items: [] },
      };

      const isDone = (itemId) => {
        const g = goalData.find((g) => g.itemId === String(itemId));
        return g ? g.done : false;
      };

      mealData?.sections?.forEach((section) => {
        section.items.forEach((it, idx) => {
          const keyBase = it.foodId ? String(it.foodId) : String(it.foodName);
          const stableId = `${section.mealType}|${keyBase}|${idx}`;
          const item = {
            id: stableId,
            text: it.foodName,
            done: isDone(stableId),
            type: 'MEAL',
          };
          if (section.mealType === 'BRE' || section.mealType === '아침')
            base['meal-am'].items.push(item);
          else if (section.mealType === 'DIN' || section.mealType === '저녁')
            base['meal-dinner'].items.push(item);
          else base['meal-lunch'].items.push(item);
        });
      });

      workoutData?.items?.forEach((it) => {
        base.strength.items.push({
          id: it.sessionNo,
          text: it.exerciseName,
          done: isDone(it.sessionNo),
          type: 'WORKOUT',
        });
      });

      setLanes(base);
    };

    fetchToday();
  }, [empNo]);

  useEffect(() => {
    if (!empNo) return;

    const fetchWeekly = async () => {
      const today = new Date();

      const thisWeekStart = getWeekStart(today);
      const thisWeekEnd = getWeekEnd(today);

      const lastWeekStart = new Date(thisWeekStart);
      lastWeekStart.setDate(thisWeekStart.getDate() - 7);
      const lastWeekEnd = new Date(thisWeekEnd);
      lastWeekEnd.setDate(thisWeekEnd.getDate() - 7);

      const fmt = (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          '0'
        )}-${String(d.getDate()).padStart(2, '0')}`;

      const res = await authFetch(
        `/api/calendar/events?empNo=${empNo}&from=${fmt(
          lastWeekStart
        )}&to=${fmt(thisWeekEnd)}`
      );
      if (!res.ok) return;
      const data = await res.json();

      const groupedMeal = {};
      const groupedWorkout = {};

      data.forEach((e) => {
        const d = new Date(e.date);

        let week = null;
        if (d >= thisWeekStart && d <= thisWeekEnd) week = '이번주';
        else if (d >= lastWeekStart && d <= lastWeekEnd) week = '지난주';
        if (!week) return;

        const day = DAYS[d.getDay()];
        if (e.type === 'meal') {
          if (!groupedMeal[day]) groupedMeal[day] = { 이번주: 0, 지난주: 0 };
          groupedMeal[day][week] += Number(e.kcal) || 0;
        } else if (e.type === 'workout') {
          if (!groupedWorkout[day])
            groupedWorkout[day] = { 이번주: 0, 지난주: 0 };
          groupedWorkout[day][week] += Number(e.kcal) || 0;
        }
      });

      setMealData(
        DAYS.map((day) => ({
          day,
          이번주: groupedMeal[day]?.이번주 || 0,
          지난주: groupedMeal[day]?.지난주 || 0,
        }))
      );

      setWorkoutData(
        DAYS.map((day) => ({
          day,
          이번주: groupedWorkout[day]?.이번주 || 0,
          지난주: groupedWorkout[day]?.지난주 || 0,
        }))
      );
    };

    fetchWeekly();
  }, [empNo]);

  const toggleItem = async (laneId, itemId) => {
    let toggled;
    setLanes((prev) => {
      const next = structuredClone(prev);
      const it = next[laneId]?.items.find((i) => i.id === itemId);
      if (it) {
        it.done = !it.done;
        toggled = { ...it };
      }
      return next;
    });

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);

    const lane = lanes[laneId];
    const it = lane?.items.find((i) => i.id === itemId);
    if (!it) return;

    await authFetch(`/api/daily-goals/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        empNo,
        goalDate: dateStr,
        itemType: it.type,
        itemId: String(it.id),
        itemText: it.text,
        done: toggled.done,
      }),
    });
  };

  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  }, []);

  return (
    <Box sx={{ p: 2, width: '100%', userSelect: 'none' }}>
      <Typography sx={{ fontWeight: 900, fontSize: '1.5em' }} gutterBottom>
        일일목표 ({todayStr})
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* 목표 카드 영역 */}
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flexShrink: 0,
          }}
        >
          {lanes.aerobics
            .filter((lane) => lane.items && lane.items.length > 0)
            .map((lane, idx) => (
              <ColumnCard
                key={idx}
                title={lane.title}
                laneId={`aerobics:${lane.title}`}
                lane={lane}
                onToggle={toggleItem}
              />
            ))}
          <ColumnCard
            title={lanes.strength.title}
            laneId="strength"
            lane={lanes.strength}
            onToggle={toggleItem}
          />
        </Box>

        <ColumnCard
          title={lanes['meal-am'].title}
          laneId="meal-am"
          lane={lanes['meal-am']}
          onToggle={toggleItem}
        />
        <ColumnCard
          title={lanes['meal-lunch'].title}
          laneId="meal-lunch"
          lane={lanes['meal-lunch']}
          onToggle={toggleItem}
        />
        <ColumnCard
          title={lanes['meal-dinner'].title}
          laneId="meal-dinner"
          lane={lanes['meal-dinner']}
          onToggle={toggleItem}
        />
      </Box>

      {/* 주간 칼로리 비교 (식사) */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
          주간 섭취한 칼로리 비교 (식사)
        </Typography>
        <Typography sx={{ mb: 2, color: 'text.secondary', fontSize: 15 }}>
          {(() => {
            const lastWeekTotal = mealData.reduce(
              (sum, d) => sum + d.지난주,
              0
            );
            const thisWeekTotal = mealData.reduce(
              (sum, d) => sum + d.이번주,
              0
            );
            return `지난주 총 섭취: ${lastWeekTotal.toLocaleString()} kcal / 이번주 총 섭취: ${thisWeekTotal.toLocaleString()} kcal`;
          })()}
        </Typography>
        <BarChart
          height={300}
          dataset={mealData}
          xAxis={[{ scaleType: 'band', dataKey: 'day' }]}
          series={[
            {
              dataKey: '지난주',
              label: '지난주 섭취',
              color: '#fbbf24',
              valueFormatter: (value) => `${value.toLocaleString()} kcal`,
            },
            {
              dataKey: '이번주',
              label: '이번주 섭취',
              color: '#f59e0b',
              valueFormatter: (value) => `${value.toLocaleString()} kcal`,
            },
          ]}
        />
      </Box>

      {/* 주간 칼로리 비교 (운동) */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
          주간 소모한 칼로리 비교 (운동)
        </Typography>
        <Typography sx={{ mb: 2, color: 'text.secondary', fontSize: 15 }}>
          {(() => {
            const lastWeekTotal = workoutData.reduce(
              (sum, d) => sum + d.지난주,
              0
            );
            const thisWeekTotal = workoutData.reduce(
              (sum, d) => sum + d.이번주,
              0
            );
            return `지난주 총 소모: ${lastWeekTotal.toLocaleString()} kcal / 이번주 총 소모: ${thisWeekTotal.toLocaleString()} kcal`;
          })()}
        </Typography>
        <BarChart
          height={300}
          dataset={workoutData}
          xAxis={[{ scaleType: 'band', dataKey: 'day' }]}
          series={[
            {
              dataKey: '지난주',
              label: '지난주 운동',
              color: '#60a5fa',
              valueFormatter: (value) => `${value.toLocaleString()} kcal`,
            },
            {
              dataKey: '이번주',
              label: '이번주 운동',
              color: '#3b82f6',
              valueFormatter: (value) => `${value.toLocaleString()} kcal`,
            },
          ]}
        />
      </Box>
    </Box>
  );
}
