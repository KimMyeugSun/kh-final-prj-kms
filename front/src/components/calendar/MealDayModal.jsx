import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Modal from '../commons/Modal';
import FoodItemNoteModal from './FoodItemNoteModal';
import authFetch from '../../utils/authFetch';
import { useAuth } from '../../auth/useAuth';

/** 식사 유형 문자열 정규화 */
function normalizeMealType(raw) {
  if (!raw) return '점심';
  const s = raw.toString().trim().toUpperCase();

  if (s === 'BRE') return '아침';
  if (s === 'LUN') return '점심';
  if (s === 'DIN') return '저녁';

  if (['아침', '조식'].includes(s)) return '아침';
  if (['점심', '중식'].includes(s)) return '점심';
  if (['저녁', '석식'].includes(s)) return '저녁';

  const lower = s.toLowerCase();
  if (['breakfast', 'morning'].includes(lower)) return '아침';
  if (['lunch', 'noon'].includes(lower)) return '점심';
  if (['dinner', 'evening', 'supper'].includes(lower)) return '저녁';

  return '점심';
}

/** 섹션 UI (아침/점심/저녁) */
function Section({ title, items, subtotal, onMore }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        {title}
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 1.25,
          borderRadius: 2,
          minHeight: 56,
          display: 'flex',
          alignItems: items.length ? 'stretch' : 'center',
        }}
      >
        {items.length ? (
          <Box sx={{ width: '100%', display: 'grid', gap: 1 }}>
            {items.map((it) => (
              <Paper
                key={it.id}
                sx={{
                  p: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 1.5,
                }}
                elevation={0}
                variant="outlined"
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600 }} noWrap>
                    {it.name}
                  </Typography>
                  {it.meta.servingDesc && (
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {it.meta.servingDesc}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    {Number(it.kcal || 0).toFixed(1)}kcal
                  </Typography>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="메모/사진 보기"
                    onClick={() => onMore?.(it)}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography sx={{ color: 'text.secondary' }}>
            등록된 식사가 없습니다.
          </Typography>
        )}
      </Paper>

      {/* 합계 kcal */}
      {subtotal > 0 && (
        <Box sx={{ mt: 0.5, textAlign: 'right' }}>
          <Typography sx={{ fontWeight: 700 }}>
            합계: {subtotal.toFixed(1)}kcal
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default function MealDayModal({ open, date, onClose }) {
  const { getEmpNo } = useAuth();
  const [events, setEvents] = useState([]);
  const [noteTargetId, setNoteTargetId] = useState(null);

  /** 서버에서 불러오기 */
  const fetchMeals = async () => {
    const empNo = getEmpNo();
    if (!empNo) return;
    try {
      const res = await authFetch(
        `/api/meals?empNo=${empNo}&date=${date.toISOString().slice(0, 10)}`
      );
      if (!res.ok) throw new Error('식사 내역 불러오기 실패');
      const data = await res.json();

      const mapped = (Array.isArray(data) ? data : []).flatMap((m) =>
        (m.items || []).map((i) => ({
          id: `${m.mealNo}-${i.itemNo}`,
          slot: normalizeMealType(m.mealType?.code || m.mealType),
          name: i.foodName,
          kcal:
            (Number(m.totalKcal || 0) * Number(i.servings)) /
            (m.items?.reduce((a, c) => a + Number(c.servings || 1), 0) || 1),
          meta: {
            mealNo: m.mealNo ?? m.meal_no,
            // 응답 케이스 방어: itemNo | item_no | id
            itemNo: i.itemNo ?? i.item_no ?? i.id,
            serving: i.servings,
            servingDesc: i.servingDesc || '',
            foodNo: i.foodNo ?? i.food_no,
            memo: m.memo || '', // ✅ DB 메모 불러오기
            photo: m.imageUrl || '', // ✅ DB 사진 불러오기
          },
        }))
      );

      setEvents(mapped);
    } catch (e) {
      console.error(e);
      setEvents([]);
    }
  };

  useEffect(() => {
    if (open) fetchMeals();
  }, [open, date]);

  /** 섹션별 그룹 및 합계 */
  const groups = useMemo(() => {
    const base = { 아침: [], 점심: [], 저녁: [] };
    events.forEach((m) => {
      base[m.slot].push(m);
    });
    const sum = (arr) => arr.reduce((a, c) => a + Number(c.kcal || 0), 0);
    return {
      data: base,
      subtotal: {
        아침: sum(base.아침),
        점심: sum(base.점심),
        저녁: sum(base.저녁),
      },
      total: sum(base.아침) + sum(base.점심) + sum(base.저녁),
    };
  }, [events]);

  const title = useMemo(() => {
    const d = new Date(date || new Date());
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}/${String(d.getDate()).padStart(2, '0')}`;
  }, [date]);

  const handleOpenMore = (item) => setNoteTargetId(item.id);
  const handleCloseMore = () => setNoteTargetId(null);

  const targetEvent = useMemo(
    () => (noteTargetId ? events.find((e) => e.id === noteTargetId) : null),
    [events, noteTargetId]
  );

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        size="lg"
        sx={{ p: 0 }}
        caption="식사 상세조회"
      >
        {/* 헤더 */}
        {/* <Box
          sx={{
            background: '#2D7DF6',
            color: '#fff',
            px: 2,
            py: 1,
            fontWeight: 800,
            borderRadius: '6px 6px 0 0',
          }}
        >
          식사 상세조회
        </Box> */}

        <Box sx={{ p: 2.25 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
            {title}
          </Typography>

          <Section
            title="아침"
            items={groups.data.아침}
            subtotal={groups.subtotal.아침}
            onMore={handleOpenMore}
          />
          <Section
            title="점심"
            items={groups.data.점심}
            subtotal={groups.subtotal.점심}
            onMore={handleOpenMore}
          />
          <Section
            title="저녁"
            items={groups.data.저녁}
            subtotal={groups.subtotal.저녁}
            onMore={handleOpenMore}
          />

          {/* 하루 총 섭취 kcal */}
          {groups.total > 0 && (
            <Paper
              variant="outlined"
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                총 섭취 칼로리: {groups.total.toFixed(1)}kcal
              </Typography>
            </Paper>
          )}
        </Box>
      </Modal>

      {/* 음식별 메모/사진 모달 */}
      {targetEvent && (
        <FoodItemNoteModal
          open
          event={targetEvent}
          onClose={handleCloseMore}
          onDeleted={() => {
            setNoteTargetId(null);
            fetchMeals(); // 당일 식사목록 새로고침
            onClose?.(true);
          }}
          onSaved={() => {
            fetchMeals();
          }}
        />
      )}
    </>
  );
}
