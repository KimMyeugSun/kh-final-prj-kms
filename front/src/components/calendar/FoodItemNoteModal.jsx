import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import Modal from '../commons/Modal';
import {
  updateCalendarEvent,
  removeCalendarEvent,
} from '../widgets/calendar/calendarStore';
import authFetch from '../../utils/authFetch';

export default function FoodItemNoteModal({
  open,
  event,
  onClose,
  onDeleted,
  onSaved,
}) {
  const fileRef = useRef(null);

  const [memo, setMemo] = useState('');
  const [photo, setPhoto] = useState(''); // 파일명만 저장

  useEffect(() => {
    setMemo(event?.meta?.memo || '');
    setPhoto(event?.meta?.photo || '');
    console.log('FoodItemNoteModal loaded:', event);
  }, [event]);

  const handlePickFile = () => fileRef.current?.click();

  // 파일 업로드
  const handleFile = async (file) => {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await authFetch('/api/meals/upload', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('업로드 실패');
      const data = await res.json();

      setPhoto(data.filePath);
    } catch (e) {
      console.error(e);
      alert(e.message || '업로드 중 오류가 발생했습니다.');
    }
  };

  //  저장
  const handleSave = async () => {
    if (!event?.meta?.mealNo) {
      alert('mealNo 정보가 없습니다.');
      return;
    }

    const mealNo = event.meta.mealNo;

    try {
      const res = await authFetch(`/api/meals/${mealNo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memo,
          imageUrl: photo || null,
        }),
      });
      if (!res.ok) throw new Error('저장 실패');
      const updated = await res.json();

      updateCalendarEvent(event.id, {
        meta: {
          ...event.meta,
          memo: updated.memo,
          photo: updated.imageUrl,
        },
      });

      alert('저장했어요!');
      onSaved?.();
      onClose?.(true);
    } catch (e) {
      console.error(e);
      alert(e.message || '저장 중 오류가 발생했습니다.');
    }
  };

  // 삭제 (확인 다이얼로그 추가)
  const handleDeleteEvent = async () => {
    const itemNo = event?.meta?.itemNo ?? event?.meta?.id;
    if (!itemNo) {
      alert('itemNo 정보가 없습니다.');
      return;
    }

    // 삭제 확인창
    const confirmDelete = window.confirm('정말로 이 음식 항목을 삭제할까요?');
    if (!confirmDelete) return;

    try {
      const res = await authFetch(
        `/api/meals/items/${encodeURIComponent(String(itemNo))}`,
        { method: 'DELETE' }
      );
      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(msg || '삭제 실패');
      }

      alert('삭제했어요!');
      onDeleted?.(event.id);
      onClose?.(true);
    } catch (e) {
      console.error(e);
      alert(e.message || '삭제 중 오류가 발생했습니다.');
    }
  };

  // 미리보기 URL
  const previewUrl =
    photo &&
    `${import.meta.env.VITE_S3_URL}${import.meta.env.VITE_S3_MEAL_IMG}${photo}`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      sx={{ p: 0 }}
      caption="음식 상세조회"
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>
          음식 사진
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '340px 1fr' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Paper
            variant="outlined"
            role="button"
            tabIndex={0}
            onClick={handlePickFile}
            onKeyDown={(e) => (e.key === 'Enter' ? handlePickFile() : null)}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files?.[0]);
            }}
            onDragOver={(e) => e.preventDefault()}
            sx={{
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              cursor: 'pointer',
              overflow: 'hidden',
              p: 1,
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="meal"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <UploadFileOutlinedIcon />
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                  Click to upload
                </Typography>
                <Typography variant="caption">drag and drop</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  PNG, JPG (max. 4000×4000)
                </Typography>
              </Box>
            )}
            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </Paper>

          <TextField
            label="메모"
            multiline
            minRows={8}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* 버튼 영역 */}
        <Box
          sx={{ mt: 3, display: 'flex', gap: 1.5, justifyContent: 'center' }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleSave}
            sx={{ minWidth: 140 }}
          >
            저장하기
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteEvent}
            disabled={!event || !event.meta}
            sx={{ minWidth: 140 }}
          >
            삭제하기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
