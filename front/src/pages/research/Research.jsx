import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material';
import HealthAndSafetyRoundedIcon from '@mui/icons-material/HealthAndSafetyRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import ResearchCard from './ResarchCard';
import RightListRow from './ListRow';
import ResearchDetailModal from './ResearchDetailModal';
import authFetch from '../../utils/authFetch';
import { useNavigate, useParams } from 'react-router-dom';
import CommonSnackbar from '../../components/commons/CommonSnackbar';

const Research = () => {
  const [loading, setLoading] = useState(true);
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState('LIFESTYLE');
  const [titles, setTitles] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  // 상세 모달 상태
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedNo, setSelectedNo] = useState(null);

  // 카테고리 선택 → URL 변경
  const handleSelect = (cat) => {
    if (cat === category) return;
    setSelectedCard(cat);
    navigate(`/research/${cat}`);
  };

  const handleOpenDetail = (no) => {
    setSelectedNo(no);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedNo(null);
  };

  const handleStartResearch = async (submitReqDto) => {
    const researchNo = submitReqDto.researchNo;
    console.log(submitReqDto.totalScore);
    console.log(researchNo);

    try {
      const resp = await authFetch(`/api/research/${researchNo}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitReqDto),
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        throw new Error(errText || '제출에 실패했습니다.');
      }
      handleCloseDetail();
      setSnackbar({
        open: true,
        message: '검사를 완료했습니다.',
        severity: 'success',
      });
    } catch (e) {
      setSnackbar({
        open: true,
        message: `${e.message}` || '실패했습니다.',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (!category) return;
    setSelectedCard(category);

    const devUrl = `/api/research?category=${category}`;
    setLoading(true);
    authFetch(devUrl)
      .then((resp) => {
        if (!resp.ok) throw new Error('조회에 실패했습니다.');
        return resp.json();
      })
      .then((data) => {
        const payload = data.data;
        setTitles(
          (payload.dataList || []).map((t) => ({ no: t.no, title: t.title }))
        );
        setCategoryList(payload.categoryList || []);
      })
      .catch(() => {
        setTitles([]);
      })
      .finally(() => setLoading(false));
  }, [category, navigate]);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        width: { xs: '100%', md: '80%' },
        mx: 'auto',
      }}
    >
      <Grid container spacing={3} justifyContent="space-evenly">
        {/* Left column */}
        <Grid
          item
          xs={12}
          sx={{
            flexBasis: { md: '40%' },
            maxWidth: { md: '40%' },
            height: '90%',
          }}
        >
          <Box
            sx={{
              bgcolor: '#FAF5EC',
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Stack spacing={3} sx={{ width: '100%', justifyContent: 'center' }}>
              <ResearchCard
                icon={<HealthAndSafetyRoundedIcon />}
                label={categoryList[0] || '일상생활 리서치'}
                active={selectedCard === 'LIFESTYLE'}
                onClick={() => handleSelect('LIFESTYLE')}
                sx={{ bgcolor: 'common.white' }}
              />
              <ResearchCard
                icon={<PsychologyRoundedIcon />}
                label={categoryList[1] || '마음건강 리서치'}
                active={selectedCard === 'MENTAL'}
                onClick={() => handleSelect('MENTAL')}
                sx={{ bgcolor: 'common.white' }}
              />
              <ResearchCard
                icon={<DirectionsRunIcon />}
                label={categoryList[2] || '신체건강 리서치'}
                active={selectedCard === 'PHYSICAL'}
                onClick={() => handleSelect('PHYSICAL')}
                sx={{ bgcolor: 'common.white' }}
              />
              <ResearchCard
                icon={<AppsRoundedIcon />}
                label={categoryList[3] || '기타'}
                sx={{ bgcolor: 'common.white' }}
              />
            </Stack>
          </Box>
        </Grid>

        {/* Right column */}
        <Grid
          item
          xs={12}
          sx={{ flexBasis: { md: '40%' }, maxWidth: { md: '40%' } }}
        >
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, marginBottom: '8%' },
              height: '85%',
              borderRadius: 3,
            }}
          >
            <Stack divider={<Divider />}>
              {titles.map((t) => (
                <RightListRow
                  key={t.no}
                  no={t.no}
                  title={t.title}
                  onOpen={handleOpenDetail}
                />
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <ResearchDetailModal
        open={openDetail}
        no={selectedNo}
        onClose={handleCloseDetail}
        onStart={handleStartResearch}
      />
      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default Research;
