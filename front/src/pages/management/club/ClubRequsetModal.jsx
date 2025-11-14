import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import authFetch from '../../../utils/authFetch';
import Modal from '../../../components/commons/Modal';
import { act, useState } from 'react';
import CommonSnackbar from '../../../components/commons/CommonSnackbar';
import { useNavigate } from 'react-router-dom';

const ClubRequsetModal = ({ open, onClose, loading, data, no }) => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  function handleSubmit(action) {
    console.log(action);

    const devUrl = `/management/api/club/category/req/${no}`;
    const option = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    };
    authFetch(devUrl, option)
      .then((resp) => {
        if (action === 'reject') {
          if (!resp.ok) throw new Error('반려처리에 실패하였습니다.');
          setSnackbar({
            open: true,
            message: '반려처리가 완료되었습니다.',
            severity: 'success',
          });
        } else if (action === 'approve') {
          if (!resp.ok) throw new Error('승인처리에 실패하였습니다.');
          setSnackbar({
            open: true,
            message: '승인처리가 완료되었습니다.',
            severity: 'success',
          });
        }
      })
      .finally(() => {
        setTimeout(() => onClose(), 1500);
        window.location.reload();
      });
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      sx={{ p: 3, width: 800, maxWidth: '92vw' }}
    >
      <DialogTitle>
        {data ? ` ${data.name}` : ''} 동호회 승인 요청 상세
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
          </Stack>
        ) : data ? (
          <Stack>
            <Stack direction="row" justifyContent="space-evenly">
              <Typography variant="subtitle1">동호회 : {data.name}</Typography>
              <Divider variant="fullWidth" orientation="vertical" flexItem />
              <Typography variant="subtitle1">
                동호회장 : {data.leaderName}
              </Typography>
            </Stack>
            <Typography variant="body2" mt={2}>
              창설 목적 : {data.purpose}
            </Typography>
            <Typography variant="body2" mt={2}>
              요청일 : {data.updatedAt?.split('T')?.[0] ?? data.updatedAt}
            </Typography>
          </Stack>
        ) : (
          <Typography color="text.secondary">데이터가 없습니다.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            handleSubmit('approve');
          }}
        >
          승인
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => {
            handleSubmit('reject');
          }}
        >
          반려
        </Button>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Modal>
  );
};

export default ClubRequsetModal;
