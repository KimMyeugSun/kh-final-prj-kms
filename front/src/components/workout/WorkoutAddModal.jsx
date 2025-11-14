import React, { useEffect, useMemo, useState } from 'react';
import { useContext } from 'react';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { v4 as uuidv4 } from 'uuid';

import Modal from '../commons/Modal';
import authFetch from '../../utils/authFetch';
import { AuthContext } from '../../auth/AuthContext';

// =============================
// MET 테이블 (fallback)
// =============================
const MET = {
  걷기: 3.5,
  런닝: 8.0,
  자전거: 7.5,
  수영: 6.0,
  필라테스: 3.0,
  요가: 3.0,
  농구: 6.5,
  탁구: 4.0,
};
const kcal = (kg, met, minutes) =>
  Math.round(kg * (met || 4.5) * (minutes / 60));
const EXERCISES = Object.keys(MET);
const DURATIONS = [30, 45, 60, 90, 120];

// =============================
// 운동 카탈로그 조회
// =============================
async function fetchCatalogByName(name) {
  try {
    const res = await authFetch(
      `/api/exercises?q=${encodeURIComponent(name)}&page=0&size=1`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const first = data?.content?.[0];
    if (!first) return null;
    return { exerciseNo: first.exerciseNo, eph: first.energyPerKgHr || 4.5 };
  } catch (e) {
    console.error('catalog 조회 실패', e);
    return null;
  }
}

// =============================
// workout 저장 API
// =============================
async function apiCreateWorkout({
  empNo,
  exerciseNo,
  workDate,
  durationMin,
  weightKg = 60,
  memo = '',
}) {
  const res = await authFetch('/api/workouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empNo,
      exerciseNo,
      workDate,
      durationMin,
      weightKg,
      memo,
    }),
  });
  if (!res.ok) throw new Error('운동 저장 실패');
  return res.json();
}

// =============================
// routine 저장 API
// =============================
async function apiCreateRoutine(empNo, routineName, items) {
  const res = await authFetch('/api/workout-routines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empNo,
      routineName,
      items: items.map((it) => ({
        exerciseNo: it.exerciseNo,
        minutes: it.minutes,
      })),
    }),
  });
  if (!res.ok) throw new Error('루틴 저장 실패');
  return res.json();
}

// =============================
// routine 목록 조회
// =============================
async function apiFetchRoutines(empNo) {
  const res = await authFetch(`/api/workout-routines?empNo=${empNo}`);
  if (!res.ok) throw new Error('루틴 목록 조회 실패');
  return res.json();
}

// =============================
// 컴포넌트 본문
// =============================
export default function WorkoutAddModal({
  open,
  onClose,
  defaultName = '',
  defaultEph = null,
  defaultDate,
  lockExercise = false,
  simpleRoutineMode = false,
}) {
  const { getEmpNo } = useContext(AuthContext);
  const labelRowSx = { height: 24, display: 'flex', alignItems: 'center' };

  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);

  const initDate =
    typeof defaultDate === 'string'
      ? defaultDate
      : defaultDate instanceof Date
      ? defaultDate.toISOString().slice(0, 10)
      : todayStr;

  const effectiveExercise = defaultName || EXERCISES[0];
  const isLocked = lockExercise || !!defaultName;

  const [tab, setTab] = useState(0);
  useEffect(() => {
    if (simpleRoutineMode) setTab(1);
  }, [simpleRoutineMode]);

  const [dateSingle, setDateSingle] = useState(initDate);
  const [dateRoutine, setDateRoutine] = useState(initDate);

  // =============================
  // 개별 운동 등록
  // =============================
  const [nameSingle, setNameSingle] = useState(effectiveExercise);
  const [minsSingle, setMinsSingle] = useState(60);
  const weightKg = 60;
  const effectiveEph = defaultEph;
  const kcalSingle = useMemo(() => {
    if (effectiveEph) {
      return Math.round(weightKg * effectiveEph * (minsSingle / 60));
    }
    return kcal(weightKg, MET[nameSingle] || 4.5, minsSingle);
  }, [nameSingle, minsSingle, effectiveEph]);

  // =============================
  // 루틴 추가
  // =============================
  const [routineName, setRoutineName] = useState('');
  const [toAddName, setToAddName] = useState(effectiveExercise);
  const [toAddMins, setToAddMins] = useState(60);
  const [routineItems, setRoutineItems] = useState([]);

  // =============================
  // 루틴 관리
  // =============================
  const [routines, setRoutines] = useState([]);
  const [selRoutineId, setSelRoutineId] = useState('');
  const selectedRoutine =
    routines.find((r) => String(r.routineNo) === String(selRoutineId)) || null;

  const [manageAddName, setManageAddName] = useState(effectiveExercise);
  const [manageAddMins, setManageAddMins] = useState(60);

  useEffect(() => {
    if (!open) return;
    setNameSingle(effectiveExercise);
    setToAddName(effectiveExercise);
    setManageAddName(isLocked ? effectiveExercise : EXERCISES[0]);
    setManageAddMins(60);
    setDateSingle(initDate);
    setDateRoutine(initDate);
  }, [open, effectiveExercise, initDate, isLocked]);

  useEffect(() => {
    if (!open) return;
    const empNo = getEmpNo();
    if (!empNo) return;
    apiFetchRoutines(empNo)
      .then((data) => setRoutines(data))
      .catch((err) => console.error(err));
  }, [open]);

  // =============================
  // 루틴 항목 추가 / 삭제
  // =============================
  const addItemToRoutine = async () => {
    const name = toAddName;
    let catalog = await fetchCatalogByName(name);
    if (!catalog) catalog = { exerciseNo: null, eph: MET[name] || 4.5 };
    const eph = catalog.eph;
    const exerciseNo = catalog.exerciseNo;

    setRoutineItems((prev) => [
      ...prev,
      {
        id: uuidv4(),
        name,
        minutes: toAddMins,
        eph,
        exerciseNo,
        kcal: Math.round(weightKg * eph * (toAddMins / 60)),
      },
    ]);
  };

  const removeItem = (id) =>
    setRoutineItems((prev) => prev.filter((i) => i.id !== id));

  // =============================
  // 등록 핸들러
  // =============================
  const handleSubmitSingle = async () => {
    try {
      const catalog = await fetchCatalogByName(nameSingle);
      if (!catalog) throw new Error('운동 카탈로그 없음');
      const empNo = getEmpNo();

      await apiCreateWorkout({
        empNo,
        exerciseNo: catalog.exerciseNo,
        workDate: dateSingle,
        durationMin: minsSingle,
        weightKg,
        memo: '',
      });

      alert('캘린더에 등록됐어요!');
      onClose?.();
    } catch (e) {
      alert('운동 저장 실패');
    }
  };

  const handleSubmitRoutineUse = async () => {
    if (!selectedRoutine) return alert('루틴을 선택해 주세요.');
    try {
      const empNo = getEmpNo();
      for (const it of selectedRoutine.items || []) {
        await apiCreateWorkout({
          empNo,
          exerciseNo: it.exerciseNo,
          workDate: dateRoutine,
          durationMin: it.minutes,
          weightKg,
          memo: '',
        });
      }
      alert('루틴이 캘린더에 등록됐어요!');
      onClose?.();
    } catch {
      alert('루틴 등록 실패');
    }
  };

  const handleSubmitRoutineAdd = async () => {
    if (!routineName.trim()) return alert('루틴 이름을 입력해주세요.');
    try {
      const empNo = getEmpNo();
      const saved = await apiCreateRoutine(
        empNo,
        routineName.trim(),
        routineItems
      );
      alert('루틴이 저장되었어요!');
      setRoutines((prev) => [...prev, saved]);
      onClose?.();
    } catch {
      alert('루틴 저장 실패');
    }
  };

  const renameSelectedRoutine = async () => {
    if (!selectedRoutine) return;
    const newName = window.prompt(
      '새 루틴 이름을 입력하세요',
      selectedRoutine.routineName
    );
    if (!newName?.trim()) return;
    try {
      const res = await authFetch(
        `/api/workout-routines/${selectedRoutine.routineNo}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ routineName: newName.trim() }),
        }
      );
      if (!res.ok) throw new Error('루틴 이름 수정 실패');
      const updated = await res.json();
      setRoutines((prev) =>
        prev.map((r) => (r.routineNo === updated.routineNo ? updated : r))
      );
    } catch {
      alert('루틴 이름 수정 실패');
    }
  };

  // =============================
  // 렌더링
  // =============================
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      sx={{ p: 0 }}
      caption="캘린더 운동 등록"
    >
      <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
        {!simpleRoutineMode && (
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="루틴 추가" />
            <Tab label="루틴 관리/등록" />
            <Tab label="개별 운동 등록" />
          </Tabs>
        )}

        {/* --- 탭 0: 루틴 추가 --- */}
        {tab === 0 && !simpleRoutineMode && (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
            <TextField
              label="새로운 루틴 이름"
              placeholder="루틴 이름을 입력해주세요"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              size="small"
              fullWidth
              helperText="*저장된 루틴은 ‘루틴 관리/등록’에서 캘린더에 등록할 수 있어요."
            />

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                label="추가할 운동 이름"
                size="small"
                value={effectiveExercise}
                InputProps={{ readOnly: true }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="운동 시간"
                select
                size="small"
                value={toAddMins}
                onChange={(e) => setToAddMins(Number(e.target.value))}
                sx={{ width: '35%' }}
              >
                {DURATIONS.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}분
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                onClick={addItemToRoutine}
                sx={{ height: 40 }}
              >
                추가
              </Button>
            </Box>

            <Paper
              variant="outlined"
              sx={{
                p: 1,
                display: 'grid',
                gap: 1,
                maxHeight: 220,
                overflow: 'auto',
              }}
            >
              {routineItems.length > 0 ? (
                routineItems.map((it, idx) => (
                  <Paper
                    key={it.id}
                    sx={{
                      p: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    elevation={1}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        {idx + 1}. {it.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {it.minutes}분
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {it.kcal}kcal
                      </Typography>
                      <IconButton
                        onClick={() => removeItem(it.id)}
                        size="small"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  추가된 항목이 없습니다.
                </Typography>
              )}
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmitRoutineAdd}
              >
                루틴 추가하기
              </Button>
            </Box>
          </Box>
        )}

        {/* --- 탭 1: 루틴 관리/등록 --- */}
        {(simpleRoutineMode || tab === 1) && (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {/* 루틴 이름 영역 */}
            <Box
              sx={{ display: 'grid', gridTemplateRows: '24px auto', gap: 1 }}
            >
              <Box sx={{ ...labelRowSx, position: 'relative' }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, lineHeight: 1 }}
                >
                  루틴 이름
                </Typography>

                {/* 수정 / 삭제 버튼 — 축소판에서는 비활성 */}
                {!simpleRoutineMode && (
                  <>
                    <Button
                      size="small"
                      variant="text"
                      onClick={renameSelectedRoutine}
                      disabled={!selectedRoutine}
                      sx={{
                        position: 'absolute',
                        right: 40,
                        top: -2,
                        minWidth: 0,
                        px: 0.5,
                        lineHeight: 1.2,
                      }}
                    >
                      수정
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      color="error"
                      disabled={!selectedRoutine}
                      onClick={async () => {
                        if (!selectedRoutine) return;
                        if (
                          !window.confirm(
                            `'${selectedRoutine.routineName}' 루틴을 삭제할까요?`
                          )
                        )
                          return;
                        const res = await authFetch(
                          `/api/workout-routines/${selectedRoutine.routineNo}`,
                          { method: 'DELETE' }
                        );
                        if (res.ok) {
                          setRoutines((prev) =>
                            prev.filter(
                              (r) => r.routineNo !== selectedRoutine.routineNo
                            )
                          );
                          setSelRoutineId('');
                          alert('루틴이 삭제되었습니다.');
                        } else alert('루틴 삭제 실패');
                      }}
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: -2,
                        minWidth: 0,
                        px: 0.5,
                        lineHeight: 1.2,
                      }}
                    >
                      삭제
                    </Button>
                  </>
                )}
              </Box>

              <TextField
                select
                size="small"
                value={selRoutineId}
                onChange={(e) => setSelRoutineId(e.target.value)}
                fullWidth
              >
                {routines.map((r) => (
                  <MenuItem key={r.routineNo} value={r.routineNo}>
                    {r.routineName}
                  </MenuItem>
                ))}
                {routines.length === 0 && (
                  <MenuItem disabled>저장된 루틴이 없습니다</MenuItem>
                )}
              </TextField>

              {/* 축소판 안내문 */}
              {simpleRoutineMode && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, ml: 0.5 }}
                >
                  *루틴 관리는 운동 상세페이지의 등록 모달에서 가능합니다.
                </Typography>
              )}
            </Box>

            {/* 운동일 */}
            <Box
              sx={{ display: 'grid', gridTemplateRows: '24px auto', gap: 1 }}
            >
              <Box sx={labelRowSx}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  운동일
                </Typography>
              </Box>
              <TextField
                type="date"
                size="small"
                value={dateRoutine}
                onChange={(e) => setDateRoutine(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>

            {/* 운동 항목 추가 입력 — 상세화면에서만 */}
            {!simpleRoutineMode && (
              <Box
                sx={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 1,
                  mt: 1,
                }}
              >
                <TextField
                  label="추가할 운동 이름"
                  size="small"
                  value={effectiveExercise}
                  InputProps={{ readOnly: true }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="운동 시간"
                  select
                  size="small"
                  value={manageAddMins}
                  onChange={(e) => setManageAddMins(Number(e.target.value))}
                  sx={{ width: '40.7%' }}
                >
                  {DURATIONS.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}분
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  disabled={!selectedRoutine}
                  onClick={async () => {
                    if (!selectedRoutine) return;
                    const catalog = await fetchCatalogByName(effectiveExercise);
                    if (!catalog) return alert('운동 카탈로그 없음');
                    const res = await authFetch(
                      `/api/workout-routines/${selectedRoutine.routineNo}/items`,
                      {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          exerciseNo: catalog.exerciseNo,
                          minutes: manageAddMins,
                        }),
                      }
                    );
                    if (!res.ok) return alert('항목 추가 실패');
                    const newItem = await res.json();
                    setRoutines((prev) =>
                      prev.map((r) =>
                        r.routineNo === selectedRoutine.routineNo
                          ? { ...r, items: [...(r.items || []), newItem] }
                          : r
                      )
                    );
                  }}
                  sx={{ height: 40 }}
                >
                  추가
                </Button>
              </Box>
            )}

            {/* 운동항목 리스트 */}
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Paper variant="outlined" sx={{ p: 1.5 }}>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>
                  운동 항목
                </Typography>
                <Box sx={{ display: 'grid', gap: 1 }}>
                  {(selectedRoutine?.items || []).map((it, i) => (
                    <Paper
                      key={it.itemNo || it.id}
                      sx={{
                        p: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRadius: 1,
                      }}
                      elevation={1}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                      >
                        <Typography sx={{ fontWeight: 700 }}>
                          {i + 1}.
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {it.exerciseName || it.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {it.minutes}분
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Typography sx={{ fontWeight: 700 }}>
                          {it.kcal ??
                            Math.round(
                              (weightKg || 60) *
                                (it.energyPerKgHr || it.eph || 4.5) *
                                (it.minutes / 60)
                            ) + 'kcal'}
                        </Typography>
                        {!simpleRoutineMode && (
                          <IconButton
                            size="small"
                            onClick={async () => {
                              const res = await authFetch(
                                `/api/workout-routines/items/${it.itemNo}`,
                                { method: 'DELETE' }
                              );
                              if (res.ok) {
                                setRoutines((prev) =>
                                  prev.map((r) =>
                                    r.routineNo === selectedRoutine.routineNo
                                      ? {
                                          ...r,
                                          items: (r.items || []).filter(
                                            (x) => x.itemNo !== it.itemNo
                                          ),
                                        }
                                      : r
                                  )
                                );
                              } else alert('삭제 실패');
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Paper>
                  ))}
                  {!selectedRoutine && (
                    <Typography variant="body2" color="text.secondary">
                      루틴을 선택해 주세요.
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Box>

            {/* 등록 버튼 */}
            <Box
              sx={{
                gridColumn: '1 / -1',
                display: 'flex',
                justifyContent: 'center',
                mt: 1,
              }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmitRoutineUse}
                disabled={
                  !selectedRoutine || (selectedRoutine.items || []).length === 0
                }
              >
                등록하기
              </Button>
            </Box>
          </Box>
        )}

        {/* --- 탭 2: 개별 운동 등록 --- */}
        {tab === 2 && !simpleRoutineMode && (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {isLocked ? (
              <TextField
                label="운동 이름"
                size="small"
                value={effectiveExercise}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            ) : (
              <TextField
                label="운동 이름"
                select
                size="small"
                value={nameSingle}
                onChange={(e) => setNameSingle(e.target.value)}
                fullWidth
              >
                {EXERCISES.map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              label="운동일"
              type="date"
              size="small"
              value={dateSingle}
              onChange={(e) => setDateSingle(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="운동 시간"
              select
              size="small"
              value={minsSingle}
              onChange={(e) => setMinsSingle(Number(e.target.value))}
              fullWidth
            >
              {DURATIONS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}분
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="소모 칼로리"
              size="small"
              value={`${kcalSingle}kcal`}
              InputProps={{ readOnly: true }}
              fullWidth
            />

            <Box
              sx={{
                gridColumn: '1 / -1',
                display: 'flex',
                justifyContent: 'center',
                mt: 1,
              }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmitSingle}
              >
                등록하기
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
