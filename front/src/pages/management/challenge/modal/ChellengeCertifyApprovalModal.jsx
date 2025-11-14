import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, TextField, Typography, Chip } from '@mui/material';
import dayjs from 'dayjs';
import Modal from '../../../../components/commons/Modal';

const fmt = (key) => (key ? dayjs(key).format('YYYY.MM.DD (ddd)') : '');
const emptyForm = { content: '', imageUrl: '' };

const ChallengeCertifyApprovalModal = ({
  open,
  onClose,
  dateKey,
  existing = false,
  existingCert = null,
  onApprove,
}) => {
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (existing && existingCert) {
      setForm({
        content: existingCert.content || '',
        imageUrl: existingCert.imageUrl || '',
      });
      setPreviewUrl(existingCert.imageUrl || '');
    } else {
      setForm(emptyForm);
      setFile(null);
      setPreviewUrl('');
    }
  }, [existing, existingCert, open]);

  // 등록 모드는 아예 차단
  if (!existing || !existingCert) return null;

  return (
    <Modal open={open} onClose={onClose} size="sm" width={700} sx={{ p: 0 }}>
      <Box
        sx={{
          p: 2,
          display: 'grid',
          gap: 2,
        }}
      >
        {/* 제목 영역 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            챌린지 인증
          </Typography>

          {existingCert?.isApproved === 'N' && (
            <Chip
              label="승인대기"
              sx={{
                bgcolor: '#F48A33',
                color: 'white',
                fontWeight: 600,
                height: 32,
                fontSize: 14,
                px: 1.5,
                borderRadius: '18px',
              }}
              size="small"
            />
          )}

          {existingCert?.isApproved === 'Y' && (
            <Chip
              label="승인완료"
              sx={{
                bgcolor: '#3DA85C',
                color: 'white',
                fontWeight: 600,
                height: 32,
                fontSize: 14,
                px: 1.5,
                borderRadius: '18px',
              }}
            />
          )}
        </Box>
        <Typography variant="body2" sx={{ color: 'content.secondary' }}>
          {dateKey ? fmt(dateKey) : ''}
        </Typography>

        {/* 좌우 레이아웃 */}
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {/* 왼쪽: 파일 업로드 & 미리보기 */}
          <Box
            sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            <Box
              sx={{
                mt: 0.5,
                width: '100%',
                maxWidth: 240,
                aspectRatio: '1 / 1',
                borderRadius: 2,
                border: '1px dashed rgba(0,0,0,0.25)',
                bgcolor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="인증 미리보기"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              ) : (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  이미지 없음
                </Typography>
              )}
            </Box>
          </Box>

          {/* 오른쪽: 인증 내용 */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              multiline
              minRows={9}
              label="인증 기록"
              name="content"
              value={form.content}
              InputProps={{ readOnly: true }}
              fullWidth
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Stack>

        {/* 버튼 영역 */}
        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="center"
          sx={{ mt: 1, width: '100%' }}
        >
          {existingCert?.isApproved === 'N' && (
            <Button
              variant="contained"
              onClick={() => onApprove && onApprove(existingCert.id)}
              sx={{ backgroundColor: '#3DA85C' }}
            >
              승인
            </Button>
          )}
          {existingCert?.isApproved === 'Y' && (
            <Button
              variant="outlined"
              onClick={() => onApprove && onApprove(existingCert.id)}
              sx={{
                backgroundColor: 'red',
                border: 'none',
                color: 'white',
              }}
            >
              승인 취소
            </Button>
          )}

          <Button variant="outlined" onClick={onClose}>
            닫기
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ChallengeCertifyApprovalModal;
