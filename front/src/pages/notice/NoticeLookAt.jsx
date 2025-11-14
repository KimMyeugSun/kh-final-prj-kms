import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authFetch from '../../utils/authFetch';
import RichText from '../../components/commons/RichText';

const NoticeLookAt = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    authFetch(`/api/noticeboard/look-at/${id}`)
      .then((data) => {
        if (!data.ok) throw new Error('공지사항 조회 실패');
        return data.json();
      })
      .then((jsondata) => {
        const data = jsondata?.data;
        if(data.success === false) {
          alert(data.message);
          navigate(-1);
          return;
        }
        setNotice(data);
      });
  }, [id]);


  if (!notice) return <Typography sx={{ m: 4 }}>로딩 중...</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {notice.title}
          </Typography>
          <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Grid>
              <Typography variant="body2" color="text.secondary">
                {notice.createdAt ? new Date(notice.createdAt).toLocaleString() : ''}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="body2" color="text.secondary">
                조회수: {notice.viewCount || 0}
              </Typography>
            </Grid>            
          </Grid>
          <Divider sx={{ mb: 2 }} />
          <RichText content={notice.content} />
        </CardContent>
      </Card>
      <Box sx={{ textAlign: 'right' }}>
        <Button sx={{ mt: 3 }} variant="contained" onClick={() => navigate(-1)}>
          이전으로
        </Button>
      </Box>
    </Box>
  );
};

export default NoticeLookAt;
