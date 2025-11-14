import React, { useEffect, useState } from 'react';
import PageTitle from '../../../define/styles/jgj/PageTitle';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import ChallengeModal from './modal/ChallengeInsertModal';
import Css from '../../../define/styles/jgj/challenge/ChallengeListCss';
import authFetch from '../../../utils/authFetch';
import { useAuth } from '../../../auth/useAuth';
import Chip from '@mui/material/Chip';
import CommonSnackbar from '../../../components/commons/CommonSnackbar';

const { VITE_S3_URL, VITE_S3_CHALLENGE_IMG } = import.meta.env;

const ChallengeManagement = () => {
  const [list, setList] = useState([]);
  const { getEmpNo } = useAuth();
  const eno = Number(getEmpNo());
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const [filter, setFilter] = useState('ALL');

  const fetchChallenge = () => {
    const url = '/api/challenge';
    const option = {};

    authFetch(url, option)
      .then((resp) => resp.json())
      .then((result) => {
        if (result.success) {
          setList(result.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchChallenge();
  }, []);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'PLANNED',
    url: '',
    file: null,
  });

  const initialForm = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'PLANNED',
    url: '',
    file: null,
  };

  const handleOpen = () => {
    setForm(initialForm);
    setOpen(true);
  };

  const handleClose = (shouldReload = false) => {
    if (shouldReload) fetchChallenge();
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
      setForm((prev) => ({ ...prev, file: files?.[0] ?? null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 챌린지 등록
  const handleSubmit = async () => {
    const fetchUrl = '/management/api/challenge';

    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('status', form.status);
    fd.append('startDate', form.startDate);
    fd.append('endDate', form.endDate);
    fd.append('file', form.file);

    try {
      const resp = await authFetch(fetchUrl, {
        method: 'POST',
        body: fd,
      });

      if (!resp.ok) {
        const result = await resp.json();
        console.error('등록 실패:', result);
        return;
      }

      setSnackbar({
        open: true,
        message: '챌린지가 등록되었습니다.',
        severity: 'success',
      });
      handleClose(true);
    } catch (e) {
      console.error(e);
    }
  };

  // 날짜 유틸
  const toLocalDate = (s) => {
    if (!s) return null;
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const isEnded = (endDateStr) => {
    if (!endDateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = toLocalDate(endDateStr);
    return end < today;
  };

  const statusChip = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip label="진행중" color="success" size="small" />;
      case 'PLANNED':
        return <Chip label="예정" color="default" size="small" />;
      case 'ENDED':
        return <Chip label="종료" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const filteredList = list.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  // ImgUrl
  const buildImgUrl = (path) => {
    if (!path) return null;
    return VITE_S3_URL + VITE_S3_CHALLENGE_IMG + path;
  };

  // 설명 잘라내기
  const cutDesc = (s, n = 30) =>
    typeof s === 'string' && s.length > n ? s.slice(0, n).trim() + '…' : s;

  return (
    <Css.Section>
      <header>
        <PageTitle>챌린지 관리</PageTitle>
        <Css.ActionsRow>
          {/* 상태 필터 Chips */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <Chip
              label="전체"
              color={filter === 'ALL' ? 'primary' : 'default'}
              variant={filter === 'ALL' ? 'filled' : 'outlined'}
              onClick={() => setFilter('ALL')}
            />
            <Chip
              label="진행중"
              color={filter === 'ACTIVE' ? 'success' : 'default'}
              variant={filter === 'ACTIVE' ? 'filled' : 'outlined'}
              onClick={() => setFilter('ACTIVE')}
            />
            <Chip
              label="예정"
              color={filter === 'PLANNED' ? 'default' : 'default'}
              variant={filter === 'PLANNED' ? 'filled' : 'outlined'}
              onClick={() => setFilter('PLANNED')}
            />
            <Chip
              label="종료"
              color={filter === 'ENDED' ? 'error' : 'default'}
              variant={filter === 'ENDED' ? 'filled' : 'outlined'}
              onClick={() => setFilter('ENDED')}
            />
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            챌린지 등록
          </Button>
        </Css.ActionsRow>
      </header>

      <Css.CardGrid>
        {filteredList.map((c) => {
          const ended = c.status === 'ENDED';
          const CardTag = ended ? Css.EndCardLink : Css.CardLink;
          const src = buildImgUrl(c.url);

          return (
            <CardTag key={c.no} to={`/management/challenge/${c.no}`}>
              {src ? <Css.Thumb src={src} alt={c.title} /> : null}
              <Css.Divider />
              <Css.Title>{c.title}</Css.Title>
              <Css.Desc>{cutDesc(c.description)}</Css.Desc>
              <Css.Detail>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>
                    {c.startDate} {c.endDate ? `~ ${c.endDate}` : null}
                  </span>
                  {statusChip(c.status)}
                </div>
              </Css.Detail>
              {ended && (
                <Css.OverlayText>챌린지가 종료되었습니다.</Css.OverlayText>
              )}
            </CardTag>
          );
        })}
      </Css.CardGrid>

      {/* 챌린지 등록 모달 */}
      <ChallengeModal
        open={open}
        onClose={handleClose}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Css.Section>
  );
};

export default ChallengeManagement;
