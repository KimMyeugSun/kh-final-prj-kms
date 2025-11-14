import React, { useCallback, useRef, useState } from 'react';
import {
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  Box,
} from '@mui/material';
import SearchBar from '../../components/commons/SearchBar';
import ExerciseSearchModal from './modals/ExerciseSearchModal';
import authFetch from '../../utils/authFetch';
import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router-dom';

const CreationRequest = () => {
  const { getEmpNo } = useAuth();
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);

  // Snackbar 상태
  const [snack, setSnack] = useState({
    open: false,
    msg: '',
    severity: 'info',
  });

  const reqIdRef = useRef(0);
  const navi = useNavigate();

  const handleClose = () => setOpen(false);
  const handleChange = (evt) => setPurpose(evt.target.value);

  const openSnack = (msg, severity = 'info') =>
    setSnack({ open: true, msg, severity });

  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const fetchData = useCallback(async (q) => {
    const currentId = ++reqIdRef.current;
    setLoading(true);
    const devUrl = '/api/club/category/create/search';
    try {
      const resp = await authFetch(devUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: q }),
      });
      if (!resp.ok) throw new Error('검색에 실패했습니다');
      const data = await resp.json();
      if (currentId === reqIdRef.current) {
        setRows(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      if (currentId === reqIdRef.current) setRows([]);
    } finally {
      if (currentId === reqIdRef.current) setLoading(false);
    }
  }, []);

  const handleSearch = (q) => {
    const next = (q ?? '').trim();
    setQuery(next);
    setOpen(true);
    fetchData(next);
  };

  const handleSelect = (selected) => {
    setSelected(selected);
    console.log(selected);
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    if (!selected) {
      openSnack('동호회를 선택해주세요', 'warning');
      return;
    }
    if (!purpose?.length) {
      openSnack('목적을 입력해주세요', 'warning');
      return;
    }

    const eno = getEmpNo();
    const createReqDto = {
      no: selected.no,
      name: selected.name,
      purpose,
      eno,
    };

    authFetch('/api/club/category', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createReqDto),
    })
      .then((resp) => {
        if (!resp.ok) throw new Error('동호회 창설 승인에 실패했습니다.');
        return resp.text();
      })
      .then((msg) => {
        openSnack(msg || '등록되었습니다', 'success');
        // 토스트가 보이도록 약간의 지연 후 이동
        setTimeout(() => navi('/club/search/page/1'), 800);
      })
      .catch((err) => {
        openSnack(err.message, 'error');
      });
  }

  return (
    <>
      <Box
        m={2}
        sx={{
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <SearchBar
          placeholder="운동 이름을 입력하거나 돋보기를 클릭하면 전체 검색이 가능합니다"
          onSearch={handleSearch}
        />
        {selected ? <Typography>동호회 명 : {selected.name}</Typography> : null}

        <TextField
          id="outlined-multiline-static"
          label="동호회 주요활동 내용"
          multiline
          rows={4}
          placeholder="동호회에서 주로 어떤 활동을 하는지 간단히 300자 이내로 작성해주세요"
          name="description"
          onChange={handleChange}
        />

        <Typography variant="overline" sx={{ fontWeight: 400, minWidth: 80 }}>
          동호회 게시판 승인은 7일~10일 정도 소요되며, 승인이 되지 않을 경우
          사내 메시지를 통하여 안내드릴 예정입니다
        </Typography>

        <Button onClick={handleSubmit} variant="contained">
          등록
        </Button>

        {/* Snackbar + Alert */}
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
      </Box>
      <ExerciseSearchModal
        open={open}
        onClose={handleClose}
        onSelect={handleSelect}
        query={query}
        rows={rows}
        loading={loading}
      />
    </>
  );
};

export default CreationRequest;
