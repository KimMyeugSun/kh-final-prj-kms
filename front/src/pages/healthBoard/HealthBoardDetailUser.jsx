import { CircularProgress, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import RichText from '../../components/commons/RichText';
import authFetch from '../../utils/authFetch';

const HealthBoardDetailUser = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cno, setCno] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // 해시태그 인풋 상태
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const bno = location.href.split('/').pop();

  const navigate = useNavigate();

  // 게시글 불러오기
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    const devUrl = `/api/health/board/user/${bno}`;
    authFetch(devUrl)
      .then((resp) => {
        if (!resp.ok) throw new Error('게시글 조회에 실패했습니다.');
        return resp.json();
      })
      .then((json) => {
        if (ignore) return;
        const data = json.data;
        setTitle(data.title);
        setContent(data.content);
        setCno(data.categoryName);
        setSelectedTags(data.tags || []);
        setTagInput(
          data.tags && data.tags.length > 0
            ? data.tags.map((tag) => `#${tag}`).join(' ')
            : ''
        );
      })
      .catch((err) => {
        if (!ignore) console.log(err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [bno]);

  if (loading)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 8,
          userSelect: 'none',
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box m={2} height="calc(100vh - 130px)" sx={{ userSelect: 'none' }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          mt: 2,
        }}
      >
        <Stack direction={'row'} justifyContent={'left'} sx={{ width: '60%' }}>
          <Typography variant="subtitle1" sx={{ minWidth: 96 }}>
            카테고리 : {cno}&nbsp;
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Typography
            label="제목"
            variant="subtitle1"
            size="small"
            sx={{ width: '60%', marginLeft: '10px' }}
            borderColor={'gray'}
          >
            제목 : {title}
          </Typography>
        </Stack>
        <Divider sx={{ my: 1 }} />

        <Box sx={{ width: '60%' }}>
          <TextField
            label="태그"
            variant="outlined"
            value={tagInput}
            size="small"
            fullWidth
          />
          <Typography variant="caption" sx={{ color: 'GrayText' }}>
            선택된 태그:{' '}
            {selectedTags.length
              ? selectedTags.map((t) => `#${t}`).join(' ')
              : '-'}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box height="calc(100vh - 300px)" sx={{ overflowY: 'auto' }}>
          <RichText content={content} />
          <Stack alignItems={'end'}>
            <Button
              variant="outlined"
              color="info"
              sx={{ width: '90px', mr: '50px' }}
              onClick={() => {
                navigate(-1);
              }}
            >
              뒤로가기
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default HealthBoardDetailUser;
