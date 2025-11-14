import React, { useMemo, useState, useEffect } from 'react';
import { Box, Button, Stack, TextField, Typography, Chip } from '@mui/material';
import dayjs from 'dayjs';
import Modal from '../../components/commons/Modal';
import { useAuth } from '../../auth/useAuth';

const fmt = (key) => (key ? dayjs(key).format('YYYY.MM.DD (ddd)') : '');
const emptyForm = { content: '', imageUrl: '' };

const ChallengeCertifyModal = ({
  open,
  onClose,
  dateKey,
  existing = false,
  existingCert = null,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const { getEmpNo } = useAuth();
  const eno = Number(getEmpNo());

  const title = useMemo(() => {
    return existing ? '인증 상세 조회' : '인증 등록';
  }, [dateKey, existing]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const handleSubmitCreate = () => {
    if (!form.content?.trim()) {
      alert('내용을 입력해 주세요.');
      return;
    }
    onCreate && onCreate({ ...form, file });
  };

  const handleSubmitUpdate = () => {
    if (!form.content?.trim()) {
      alert('내용을 입력해 주세요.');
      return;
    }
    onUpdate && onUpdate({ ...form, file });
  };

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠어요?')) {
      onDelete && onDelete();
    }
  };

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
            {title}
          </Typography>

          {existing && existingCert?.isApproved === 'N' && (
            <Chip
              label="승인대기"
              sx={{
                bgcolor: '#F48A33',
                color: 'white',
                fontWeight: 600,
                height: 32,
                fontSize: 14,
                px: 1.5,
                borderRadius: '12px',
              }}
              size="small"
            />
          )}

          {existing && existingCert?.isApproved === 'Y' && (
            <Chip
              label="승인완료"
              sx={{
                bgcolor: '#3DA85C',
                color: 'white',
                fontWeight: 600,
                height: 32,
                fontSize: 14,
                px: 1.5,
                borderRadius: '12px',
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
              component="label"
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
                cursor: 'pointer',
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
                <Stack spacing={1} alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Click to upload
                  </Typography>
                  <Typography
                    variant="caption"
                    color="content.secondary"
                    align="center"
                  >
                    PNG, JPG
                    <br />
                    (max. 400×400px)
                  </Typography>
                </Stack>
              )}

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
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
              onChange={handleChange}
              placeholder="오늘의 챌린지 인증 기록을 작성하세요."
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
          {!existing && eno !== 0 && (
            <Button variant="contained" onClick={handleSubmitCreate}>
              등록
            </Button>
          )}
          {existing && eno !== 0 && existingCert?.isApproved !== 'Y' && (
            <>
              <Button variant="contained" onClick={handleSubmitUpdate}>
                수정
              </Button>
              <Button color="error" variant="outlined" onClick={handleDelete}>
                삭제
              </Button>
            </>
          )}

          <Button variant="outlined" onClick={onClose}>
            닫기
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ChallengeCertifyModal;
