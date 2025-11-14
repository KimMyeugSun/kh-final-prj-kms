import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authFetch from '../../../../utils/authFetch';

const ManagementFaqLookAt = () => {
  const { id } = useParams();
  const [faq, setFaq] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    authFetch(`/management/api/faq/look-at/${id}`)
      .then((data) => {
        if (!data.ok) throw new Error('FAQ 상세 조회 실패');
        return data.json();
      })
      .then((jsondata) => {
        const data = jsondata?.data;
        if(!data) throw new Error('FAQ 데이터 없음');

        setFaq(data);
      });
  }, [id]);

  const handleDelete = () => {
    // 삭제 로직 구현 필요
    authFetch(`/management/api/faq/delete/${id}`, {
      method: 'DELETE',
    })
      .then((data) => {
        if (!data.ok) throw new Error('FAQ 삭제 실패');
        navigate(-1);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <Box m={2} sx={{ userSelect: 'none' }}>
      <Typography variant="h4" gutterBottom>FAQ 상세 조회 </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ mb: 2,  gap: 2, display: 'flex', alignItems: 'end' }}>
        <Chip label={faq.faqCategoryName} sx={{borderRadius: 1, fontSize: '1rem', fontWeight: 'bold', boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'}}/>
        <Typography variant='h6'>{faq.faqAsk}</Typography>
      </Box>
      <Paper variant="outlined" sx={{ p: 1, bgcolor: '#f5f5f5', minHeight: 580 }}>
        {faq.faqAnswer}
      </Paper>
      <Divider sx={{ mb: 2, mt: 2 }} />
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button variant="outlined" color="primary" onClick={() => navigate(-1)}>목록</Button>
        <Button variant="contained" color="primary" onClick={() => navigate(`/management/notice_faq/faq/edit/${id}`)}>수정</Button>
        <Button color="error" onClick={handleDelete}>삭제</Button>
      </Box>
    </Box>
  );
};

export default ManagementFaqLookAt;