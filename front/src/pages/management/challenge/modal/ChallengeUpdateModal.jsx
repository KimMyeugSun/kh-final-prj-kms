import React, { useMemo, useEffect } from 'react';
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import Modal from '../../../../components/commons/Modal';

export default function ChallengeUpdateModal({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  imageUrl,
}) {
  const previewUrl = useMemo(() => {
    if (form?.file instanceof File) {
      return URL.createObjectURL(form.file);
    }
    return null;
  }, [form?.file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
    backgroundColor: '#f5f5f5',
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      sx={{ p: 3, width: 980, maxWidth: '96vw' }}
    >
      <Box component="header" sx={{ mb: 2, fontSize: 18, fontWeight: 800 }}>
        챌린지 수정
      </Box>

      <Paper elevation={0} sx={{ p: 3, bgcolor: '#fff', borderRadius: 2 }}>
        <Grid
          container
          columnSpacing={4}
          rowSpacing={3}
          alignItems="flex-start"
        >
          {/* 좌측 : 배너 이미지 */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ minWidth: 0 }}>
            <Stack spacing={1.2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                배너 이미지
              </Typography>
              <Box
                component="label"
                sx={{
                  mt: 0.5,
                  width: '100%',
                  maxWidth: { md: 320 },
                  aspectRatio: '1 / 1',
                  borderRadius: 2,
                  border: '1px dashed rgba(0,0,0,0.25)',
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="새 이미지 미리보기"
                    style={imgStyle}
                  />
                ) : imageUrl ? (
                  <img src={imageUrl} alt="기존 배너 이미지" style={imgStyle} />
                ) : (
                  <Stack spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Click to upload
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      drag and drop
                    </Typography>
                  </Stack>
                )}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onChange?.({ target: { name: 'file', value: file } });
                  }}
                />
              </Box>
            </Stack>
          </Grid>

          {/* 우측 : 폼 */}
          <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
            <Stack spacing={2.2}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    label="챌린지명"
                    name="title"
                    value={form?.title ?? ''}
                    onChange={onChange}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    select
                    label="상태"
                    name="status"
                    value={form?.status || ''}
                    onChange={onChange}
                    fullWidth
                    SelectProps={{ native: true }}
                  >
                    <option value="PLANNED">예정</option>
                    <option value="ACTIVE">진행중</option>
                    <option value="ENDED">종료</option>
                  </TextField>
                </Grid>
              </Grid>

              <TextField
                label="챌린지 내용"
                name="description"
                value={form?.description ?? ''}
                onChange={onChange}
                fullWidth
                multiline
                minRows={6}
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="시작일"
                    name="startDate"
                    type="date"
                    value={form?.startDate ?? ''}
                    onChange={onChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="종료일"
                    name="endDate"
                    type="date"
                    value={form?.endDate ?? ''}
                    onChange={onChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          {/* 버튼 */}
          <Grid size={12}>
            <Divider sx={{ my: 1.5 }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1.5,
                width: '100%',
                mt: 2,
              }}
            >
              <Button
                onClick={() => onSubmit?.()}
                variant="contained"
                sx={{ px: 4 }}
              >
                수정
              </Button>
              <Button onClick={onClose} variant="outlined" sx={{ px: 4 }}>
                취소
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
}
