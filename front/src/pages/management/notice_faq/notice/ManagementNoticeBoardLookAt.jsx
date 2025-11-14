import { Box, Typography, Card, CardContent, Divider, Grid, Chip, styled, Button, TextField, CircularProgress } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../auth/useAuth';
import authFetch from '../../../../utils/authFetch';
import RichText from '../../../../components/commons/RichText';
import EditorToolbar from '../../../../components/commons/EditorToolbar';

const ManagementNoticeBoardLookAt = () => {
  const { getEmpNo } = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const editorRef = useRef();
  const [noticeData, setNoticeData] = useState({title: '', content: '', noticeBoardNo: 0, viewCount: 0});
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    setLoading(true);
    authFetch(`/management/api/noticeboard/look-at/${id}`)
      .then((data) => {
        if (!data.ok) throw new Error('공지사항 조회 실패');
        return data.json();
      })
      .then((jsondata) => {
        if(!jsondata.success)
          throw new Error(jsondata.msg || '공지사항 조회 실패');
        const data = jsondata.data;
        
        setNoticeData(data);
        setOriginalData(data);

      })
      .finally(() => { setLoading(false); });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('삭제하시겠습니까?')) {
      (async () => {
        setLoading(true);
        try {
          const response = await authFetch(`/management/api/noticeboard/soft-delete/${id}`, {
            method: 'DELETE',
          });
          if (!response.ok) throw new Error('공지사항 삭제 실패');
          const jsondata = await response.json();
          if (!jsondata.success) throw new Error(jsondata.msg || '공지사항 삭제 실패');
          navigate(-1);
        } catch (err) {
          console.error('공지사항 삭제 중 오류 발생:', err);
        } finally {
          setLoading(false);
        }
      })();
    }
  };

  const handleSubmit = () => {
      const uploadedFiles = editorRef.current?.getUploadedImages() || [];
  
      const respBody = {
        title: noticeData.title,
        content: noticeData.content,
        eno: getEmpNo(),
        templateFiles: uploadedFiles
      };      
  
      (async () => {
        setLoading(true);
        try {
          const response = await authFetch(`/management/api/noticeboard/edit/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(respBody),
          });
          if (!response.ok) throw new Error('공지사항 수정 실패');
          const jsondata = await response.json();

          if(!jsondata.success)
            throw new Error(jsondata.msg || '공지사항 수정 실패');

          navigate(-1);

        } catch (err) {
          console.error('공지사항 수정 중 오류 발생:', err);
        } finally {
          setLoading(false);
        }
      })();
  }

  const handleChange = (field, value) => {
    setNoticeData(prev => ({ ...prev, [field]: value }) );
  };

  const isDisabled = loading || !(originalData && (originalData.title !== noticeData.title || originalData.content !== noticeData.content));

  return (
    <Box position="relative">
      <Box m={2} height="calc(100vh - 130px)" sx={{ userSelect: 'none' }}>
        <Typography sx={{ fontWeight: 900, fontSize: '1.5em' }} gutterBottom>No.{noticeData.noticeBoardNo} 공지 사항</Typography>
        <Divider />
        <Box sx={{ width: '100%', height: 'calc(100% - 130px)', display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
            <TextField label="제목" variant="outlined" value={noticeData.title} size='small' onChange={e => handleChange('title', e.target.value)} fullWidth />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>조회수: {Number(noticeData.viewCount).toLocaleString()}</Typography>
            <EditorToolbar ref={editorRef} value={noticeData.content} onChange={(value) => handleChange('content', value)} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
            <Button variant="outlined" color="error" onClick={handleDelete}>삭제</Button>
            <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={isDisabled}>수정</Button>
            <Button variant="contained" onClick={() => navigate(-1)}>뒤로</Button>
          </Box>
        </Box>
      </Box>
      {loading && (
        <Box sx={{
          position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20
        }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default ManagementNoticeBoardLookAt;
