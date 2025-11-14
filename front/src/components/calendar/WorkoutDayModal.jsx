import React, { useEffect, useMemo, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Modal from '../commons/Modal';
import authFetch from '../../utils/authFetch';
import { AuthContext } from '../../auth/AuthContext';

/* ----------------------------------------
 * 아이템 뷰 (운동 항목 1개)
 * -------------------------------------- */
function ItemRow({ index, item, onRemove }) {
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 1.25,
        borderRadius: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Typography sx={{ fontWeight: 800 }}>{index}.</Typography>
        <Box>
          <Typography sx={{ fontWeight: 700 }}>{item.exerciseName}</Typography>
          <Typography variant="caption" color="text.secondary">
            {item.durationMin}분
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Typography sx={{ fontWeight: 800 }}>{item.kcal}kcal</Typography>
        <IconButton
          size="small"
          aria-label="삭제"
          sx={{ color: '#ef4444' }}
          onClick={() => onRemove?.(item.sessionNo)}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
}

/* ----------------------------------------
 * WorkoutDayModal
 * -------------------------------------- */
export default function WorkoutDayModal({ open, date, onClose }) {
  const { getEmpNo } = useContext(AuthContext); // ✅ Context에서 empNo 얻기
  const empNo = getEmpNo();

  const [items, setItems] = useState([]); // WorkoutItem[]
  const [totalKcal, setTotalKcal] = useState(0);
  const [dayMemo, setDayMemo] = useState('');

  // yyyy-MM-dd 문자열
  const dateStr = useMemo(() => {
    const d = new Date(date || new Date());
    return d.toISOString().slice(0, 10);
  }, [date]);

  const titleText = useMemo(() => {
    const d = new Date(date || new Date());
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}/${mm}/${dd}`;
  }, [date]);

  // 서버에서 운동 상세 조회
  useEffect(() => {
    if (!open || !empNo) return;

    authFetch(`/api/calendar/workouts/detail?empNo=${empNo}&date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setTotalKcal(Number(data.totalKcal || 0));
        setDayMemo(data.dayMemo || '');
      })
      .catch((err) => console.error('운동 상세 조회 실패', err));
  }, [open, dateStr, empNo]);

  // 개별 운동 삭제
  const removeOne = (sessionNo) => {
    if (!window.confirm('이 운동을 삭제할까요?')) return;

    authFetch(`/api/workouts/${encodeURIComponent(String(sessionNo))}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setItems((prev) => {
          const target = prev.find((it) => it.sessionNo === sessionNo);
          if (!target) return prev;
          setTotalKcal((k) => k - Number(target.kcal || 0));
          return prev.filter((it) => it.sessionNo !== sessionNo);
        });
        alert('삭제 완료');
        onClose?.(true);
      })
      .catch(() => alert('삭제 실패'));
  };

  // 하루 전체 삭제
  const removeAllForDay = () => {
    if (!window.confirm('이 날짜의 운동 기록을 전부 삭제할까요?')) return;
    if (!empNo) return;

    authFetch(
      `/api/workouts?empNo=${encodeURIComponent(
        String(empNo)
      )}&date=${encodeURIComponent(dateStr)}`,
      { method: 'DELETE' }
    )
      .then((res) => {
        if (!res.ok) throw new Error();
        setItems([]);
        setTotalKcal(0);
        setDayMemo('');
        alert('삭제 완료');
        onClose?.(true);
      })
      .catch(() => alert('삭제 실패'));
  };

  // 메모 저장
  const saveMemo = () => {
    if (!empNo) return;

    authFetch(`/api/workouts/memo?empNo=${empNo}&date=${dateStr}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'text/plain' },
      body: dayMemo,
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        alert('저장했어요!');
        onClose?.(true);
      })
      .catch(() => alert('저장 실패'));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      sx={{ p: 0 }}
      caption="운동 상세조회"
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
        운동 상세조회
      </Box> */}

      <Box sx={{ p: 2.25 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
          {titleText}
        </Typography>

        {/* 진행한 운동 */}
        <Box sx={{ mb: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
            진행한 운동
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 1.25,
              borderRadius: 2,
              display: 'grid',
              gap: 1,
              minHeight: 64,
            }}
          >
            {items.length ? (
              items.map((it, idx) => (
                <ItemRow
                  key={it.sessionNo}
                  index={idx + 1}
                  item={it}
                  onRemove={(sn) => removeOne(Number(sn))}
                />
              ))
            ) : (
              <Typography sx={{ color: 'text.secondary' }}>
                등록된 운동이 없습니다.
              </Typography>
            )}
          </Paper>
        </Box>

        {/* 총 칼로리 + 메모 */}
        <Box
          sx={{
            mt: 2,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2,
            alignItems: 'start',
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
              총 소모 칼로리
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                minHeight: 90,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                {totalKcal}kcal
              </Typography>
            </Paper>
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
              메모
            </Typography>
            <TextField
              multiline
              minRows={4}
              fullWidth
              placeholder="오늘 운동에 대해 적어두세요."
              value={dayMemo}
              onChange={(e) => setDayMemo(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </Box>

        {/* 버튼 */}
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            gap: 1.5,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={saveMemo}
            sx={{ minWidth: 140 }}
          >
            저장하기
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={removeAllForDay}
            sx={{ minWidth: 140 }}
          >
            삭제하기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
