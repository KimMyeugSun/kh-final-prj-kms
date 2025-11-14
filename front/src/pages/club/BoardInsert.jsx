import {
  Alert,
  Button,
  Snackbar,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import authFatch from '../../utils/authFetch.js';

const BoardInsert = () => {
  const { getEmpNo } = useAuth();
  const navi = useNavigate();
  const [write, setWrite] = useState({ title: '', content: '' });
  const [snack, setSnack] = useState({
    open: false,
    msg: '',
    severity: 'info',
  });

  function handleChange(evt) {
    const { name, value } = evt.target;
    setWrite((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    const cno = location.href.split('/')[5];
    const eno = getEmpNo();

    if (write.title.length <= 0 || write.title.length > 31) {
      openSnack('제목이 없거나 너무 길게 작성했습니다', 'warning');
      return;
    }
    if (write.content.length <= 0 || write.content.length > 1001) {
      openSnack('내용이 없거나 너무 길게 작성했습니다', 'warning');
      return;
    }
    const reqDto = {
      title: write.title,
      content: write.content,
      cno: cno,
      eno: eno,
    };
    const devUrl = `/api/club/board`;
    const option = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqDto),
    };

    authFatch(devUrl, option)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('게시글 등록에 실패했습니다.');
        } else {
          return resp.text();
        }
      })
      .then((msg) => {
        openSnack(msg || '등록되었습니다', 'success');
        setTimeout(() => navi(`/club/board/${cno}/page/1`), 800);
      })
      .catch((err) => {
        openSnack(err.message, 'error');
      });
  }
  const openSnack = (msg, severity = 'info') =>
    setSnack({ open: true, msg, severity });

  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  return (
    <>
      <Stack direction={'column'}>
        <Button
          onClick={() => {
            navi(-1);
          }}
          sx={{ width: '100px' }}
        >
          뒤로가기
        </Button>
        <br />
        <TextField
          label="게시글 제목"
          placeholder="제목은 30자 이내로 작성해주세요"
          name="title"
          onChange={handleChange}
          value={write.title}
        />
        <br />
        <TextField
          multiline
          rows={4}
          name="content"
          placeholder="내용을 입력하세요"
          onChange={handleChange}
          value={write.content}
        />
        <br />
        <Button variant="contained" onClick={handleSubmit}>
          저장하기
        </Button>
      </Stack>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnack}
          severity={snack.severity}
          sx={{ width: '100%' }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BoardInsert;
