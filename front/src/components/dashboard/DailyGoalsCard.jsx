import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import CardShell from './CardShell';
import authFetch from '../../utils/authFetch';
import { useAuth } from '../../auth/useAuth';

export default function DailyGoalsCard({ events = [], goals }) {
  const { getEmpNo } = useAuth();
  const empNo = getEmpNo();

  // null 금지: [null] 때문에 map()에서 터졌음
  const [innerGoals, setInnerGoals] = useState([]);

  useEffect(() => {
    if (!empNo) return;

    // 부모가 goals를 내려주면 그걸로 동기화 (1회)
    if (Array.isArray(goals) && goals.length > 0) {
      setInnerGoals(goals);
      return;
    }

    // 부모 goals가 없으면 내부에서 오늘 것만 1회 조회
    let aborted = false;
    const fetchGoals = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const res = await authFetch(
          `/api/daily-goals?empNo=${empNo}&date=${today}`
        );
        if (!res?.ok) return;
        const data = await res.json();
        if (!aborted && Array.isArray(data)) {
          setInnerGoals(data);
        }
      } catch {
        // 네트워크 에러 무시 (UI 깨짐 방지)
      }
    };

    fetchGoals();
    return () => {
      aborted = true;
    };
  }, [empNo, goals]);

  // 최종 사용할 goals
  const goalsList =
    Array.isArray(goals) && goals.length > 0 ? goals : innerGoals;

  const items = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);

    // 오늘 이벤트만 필터링
    const todayEvents = (Array.isArray(events) ? events : []).filter((evt) => {
      const start =
        evt?.start instanceof Date ? evt.start : new Date(evt?.start);
      return !isNaN(start) && start.toISOString().slice(0, 10) === todayKey;
    });

    // 카테고리 그룹
    const grouped = { 아침: [], 점심: [], 저녁: [], 운동: [] };

    todayEvents.forEach((evt) => {
      if (evt?.type === 'meal') {
        (evt.mealItems || []).forEach((m) => {
          const mealType = m?.mealType;
          if (mealType === 'BRE') grouped['아침'].push(...(m.items || []));
          else if (mealType === 'LUN') grouped['점심'].push(...(m.items || []));
          else if (mealType === 'DIN') grouped['저녁'].push(...(m.items || []));
        });
      } else if (evt?.type === 'workout') {
        grouped['운동'].push(...(evt.items || []));
      }
    });

    // 출력 순서
    const ordered = [];
    if (grouped['아침'].length)
      ordered.push({ label: '아침', items: grouped['아침'] });
    if (grouped['점심'].length)
      ordered.push({ label: '점심', items: grouped['점심'] });
    if (grouped['저녁'].length)
      ordered.push({ label: '저녁', items: grouped['저녁'] });
    if (grouped['운동'].length)
      ordered.push({ label: '운동', items: grouped['운동'] });

    // goals 안전 처리: null 제거 + 키 추출
    const safeGoals = Array.isArray(goalsList)
      ? goalsList.filter((g) => g && (g.itemId ?? g.item_id ?? g.key) != null)
      : [];

    // done 맵
    const doneMap = new Map(
      safeGoals.map((g) => {
        const key = String(g.itemId ?? g.item_id ?? g.key);
        const done = typeof g.done === 'boolean' ? g.done : g.doneYn === 'Y';
        return [key, !!done];
      })
    );

    const withDone = ordered.map((cat) => ({
      ...cat,
      items: cat.items.map((it, idx) => {
        if (
          cat.label === '아침' ||
          cat.label === '점심' ||
          cat.label === '저녁'
        ) {
          // 식사 항목 키 규칙: mealType|keyBase|idx
          const mealType =
            cat.label === '아침' ? 'BRE' : cat.label === '점심' ? 'LUN' : 'DIN';
          const keyBase = it?.foodId
            ? String(it.foodId)
            : String(it?.text ?? it?.name ?? '');
          const itemKey = `${mealType}|${keyBase}|${idx}`;
          return { ...it, done: doneMap.get(itemKey) ?? false };
        }
        // 운동 항목: 서버가 내려준 key/itemId 있으면 그것도 인식
        const workoutKey = String(it?.key ?? it?.itemId ?? it?.item_id ?? '');
        const workoutDone = workoutKey
          ? doneMap.get(workoutKey) ?? it?.done ?? false
          : it?.done ?? false;
        return { ...it, done: workoutDone };
      }),
    }));

    return withDone;
  }, [events, goalsList]);

  return (
    <CardShell title="일일목표">
      <Box
        component="ul"
        sx={{ m: 0, pl: 2, lineHeight: 1.9, color: 'text.primary' }}
      >
        {items.length > 0 ? (
          items.map((cat, idx) => (
            <li key={idx}>
              {cat.label} -{' '}
              {cat.items.map((it, i) => (
                <span
                  key={i}
                  style={{
                    textDecoration: it?.done ? 'line-through' : 'none',
                    color: it?.done ? '#999' : 'inherit',
                    marginRight: 6,
                  }}
                >
                  {it?.text ?? it?.name ?? it?.foodName ?? ''}
                  {i < cat.items.length - 1 ? ',' : ''}
                </span>
              ))}
            </li>
          ))
        ) : (
          <li style={{ color: '#999' }}>오늘 등록된 일정이 없습니다.</li>
        )}
      </Box>
    </CardShell>
  );
}
