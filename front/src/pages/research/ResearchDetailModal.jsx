import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../../components/commons/Modal';
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Stack,
  Chip,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormHelperText,
  Alert,
} from '@mui/material';
import authFetch from '../../utils/authFetch';
import { useAuth } from '../../auth/useAuth';

const ResearchDetailModal = ({ open, onClose, no, onStart }) => {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({}); // { [qno]: { ono, value } }
  const { getEmpNo } = useAuth();
  // 상세 조회
  useEffect(() => {
    if (!open || !no) return;
    setLoading(true);
    setError('');
    setDetail(null);
    setAnswers({});

    const devUrl = `/api/research/${no}`;
    authFetch(devUrl)
      .then((resp) => {
        if (!resp.ok) throw new Error('상세 조회에 실패했습니다.');
        return resp.json();
      })
      .then((data) => {
        setDetail(data?.data ?? null);
      })
      .catch((e) => setError(e.message || '에러가 발생했습니다.'))
      .finally(() => setLoading(false));
  }, [open, no]);

  const optionMap = useMemo(() => {
    const map = new Map(); // key: questionNo, val: option[]
    if (!detail?.optionList) return map;
    for (const opt of detail.optionList) {
      const arr = map.get(opt.questionNo) || [];
      arr.push(opt);
      map.set(opt.questionNo, arr);
    }
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => (a.value ?? 0) - (b.value ?? 0));
      map.set(k, arr);
    }
    return map;
  }, [detail]);

  // 선택 변경
  const handleChange = (qno) => (evt) => {
    const selectedOno = Number(evt.target.value);
    const opt = (optionMap.get(qno) || []).find((o) => o.ono === selectedOno);
    setAnswers((prev) => ({
      ...prev,
      [qno]: { ono: selectedOno, value: opt?.value ?? null },
    }));
  };

  // 제출(필수 질문 체크 후 상위로 전달)
  const handleSubmit = () => {
    if (!detail?.questionList?.length) {
      setError('질문이 없습니다.');
      return;
    }
    setError('');

    const missing = detail.questionList.filter((q) => {
      const isReq = (q.required ?? q.requlred) === 'Y'; // 'requlred' 오타 대응
      return isReq && !answers[q.qno];
    });

    if (missing.length > 0) {
      const list = missing.map((m) => `Q${m.qno}`).join(', ');
      setError(`필수 문항에 응답해주세요: ${list}`);
      return;
    }

    const payload = detail.questionList.map((q) => {
      const ans = answers[q.qno];
      return {
        qno: q.qno,
        ono: ans?.ono ?? null,
        value: ans?.value ?? null,
      };
    });

    const eno = getEmpNo();
    const totalScore = payload.reduce((sum, p) => sum + p.value, 0);
    const submitReqDto = {
      eno,
      totalScore,
      researchNo: detail.no,
      topic: detail.topic,
    };
    if (onStart) {
      onStart(submitReqDto);
    } else {
      console.log('submit payload', submitReqDto);
      onClose?.();
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="md" sx={{ p: 0, width: 900 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 96px)',
          overflow: 'hidden',
          p: 3,
          pt: 2,
        }}
      >
        {/* 제목/메타 - 고정 영역 (스크롤 안 됨) */}
        <Box>
          <Typography variant="h6" noWrap>
            {detail ? detail.title : '리서치'}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
            {detail?.category && (
              <Chip label={`카테고리: ${detail.category}`} />
            )}
            {detail?.required && <Chip label={`필수: ${detail.required}`} />}
            {detail?.cycle && <Chip label={`주기: ${detail.cycle}`} />}
            {detail?.createdAt && (
              <Chip label={`생성일: ${detail.createdAt}`} variant="outlined" />
            )}
          </Stack>

          {detail?.description && (
            <Typography variant="body2">{detail.description}</Typography>
          )}

          <Divider sx={{ mt: 2 }} />
        </Box>

        <Box
          sx={{
            overflowY: 'auto',
            height: 400,
            py: 2,
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : !detail ? (
            <Typography variant="body2">데이터가 없습니다.</Typography>
          ) : (
            <Stack spacing={3}>
              {(detail.questionList || []).map((q, idx) => {
                const qno = q.qno;
                const req = (q.required ?? q.requlred) === 'Y';
                const opts = optionMap.get(qno) || [];
                const selectedOno = answers[qno]?.ono ?? '';

                return (
                  <FormControl
                    key={qno}
                    component="fieldset"
                    required={req}
                    error={req && !answers[qno]}
                  >
                    <FormLabel component="legend">
                      {idx + 1}. {q.question}{' '}
                      {req ? (
                        <Chip size="small" label="필수" sx={{ ml: 1 }} />
                      ) : null}
                    </FormLabel>
                    <RadioGroup
                      row
                      sx={{ flexWrap: 'wrap' }}
                      name={`q-${qno}`}
                      value={selectedOno}
                      onChange={handleChange(qno)}
                    >
                      {opts.map((o) => (
                        <FormControlLabel
                          key={o.ono}
                          value={o.ono}
                          control={<Radio />}
                          label={o.option}
                        />
                      ))}
                    </RadioGroup>
                    {req && !answers[qno] && (
                      <FormHelperText>이 문항에 응답해주세요.</FormHelperText>
                    )}
                  </FormControl>
                );
              })}
            </Stack>
          )}
        </Box>

        <Divider sx={{ mb: 0 }} />

        <Box sx={{ pt: 2 }}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={detail?.questionList?.some(
                (q) => (q.required ?? q.requlred) === 'Y' && !answers[q.qno]
              )}
            >
              제출
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default ResearchDetailModal;
