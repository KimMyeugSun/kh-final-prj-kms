import React, { useState } from 'react';
import Modal from '../../../components/commons/Modal';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material';
import { useAuth } from '../../../auth/useAuth';
import CommonSnackbar from '../../../components/commons/CommonSnackbar';
import authFetch from '../../../utils/authFetch';

const ReportModal = ({ open, onClose, loading }) => {
  const [contnet, setContent] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [closeTimer, setCloseTimer] = useState(null);
  const { getEmpNo } = useAuth();
  const eno = getEmpNo();
  const reqDto = { eno: eno, reportContent: contnet || selectedReason };
  const no = location.href.split('/').pop();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleRadioChange = (evt) => {
    setSelectedReason(evt.target.value);
    setContent(''); // 라디오 선택하면 직접 입력창 비우기
  };

  const handleTextChange = (evt) => {
    setContent(evt.target.value);
    if (evt.target.value.trim().length > 0) {
      setSelectedReason(''); // 직접 입력하면 라디오 선택 해제
    }
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    if (contnet.length <= 0 && selectedReason.length <= 0) {
      setSnackbar({
        open: true,
        message: '신고 내용을 입력해주세요.',
        severity: 'error',
      });
      return;
    }
    const devUrl = `/api/club/board/report/${no}`;
    const option = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqDto),
    };

    authFetch(devUrl, option)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('신고 실패');
        } else {
          return resp.json();
        }
      })
      .then((data) => {
        setSnackbar({
          open: true,
          message: data.msg,
          severity: 'success',
        });
        setTimeout(() => {
          onClose();
        }, 2500);
      })
      .finally(() => {
        if (closeTimer) {
          clearTimeout(closeTimer);
        }

        // 타이머 중첩되지 않도록 새로운 타이머 설정
        const timer = setTimeout(() => {
          onClose();
        }, 2500);
        setCloseTimer(timer);
      });
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        setContent('');
        onClose?.();
      }}
      caption="게시글 신고"
    >
      <Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack direction={'column'}>
            <br />
            <FormControl key={no} component="fieldset">
              <RadioGroup
                row
                value={selectedReason}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  key={1}
                  value={'욕설, 저속한 단어가 포함된 게시글 입니다'}
                  control={<Radio />}
                  label={'욕설, 저속한 단어가 포함된 게시글 입니다'}
                />
                <FormControlLabel
                  key={2}
                  value={'영리(홍보)성의 광고 게시글 입니다'}
                  control={<Radio />}
                  label={'영리(홍보)성의 광고 게시글 입니다'}
                />
                <FormControlLabel
                  key={3}
                  value={'같은 내용을 계속 반복하는 게시글 입니다'}
                  control={<Radio />}
                  label={'같은 내용을 계속 반복하는 게시글 입니다'}
                />
              </RadioGroup>
              <br />
              <FormHelperText>
                위에 해당하는 내용이 없으실 경우 작성해주세요.
              </FormHelperText>
            </FormControl>
            <TextField
              label="신고 내용"
              placeholder="내용은 100자 이내로 작성해주세요"
              onChange={handleTextChange}
              id="reportContent"
            ></TextField>
            <br />
            <br />
            <Button variant="contained" onClick={handleSubmit}>
              신고하기
            </Button>
          </Stack>
        )}
      </Box>
      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Modal>
  );
};

export default ReportModal;
