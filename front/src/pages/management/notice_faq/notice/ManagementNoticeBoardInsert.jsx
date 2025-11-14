import { Box, Button, Divider, Typography, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../auth/useAuth';
import authFetch from '../../../../utils/authFetch';
import EditorToolbar from '../../../../components/commons/EditorToolbar';

const ManagementNoticeBoardInsert = () => {
  const { getEmpNo } = useAuth();
  const navigate = useNavigate();
  const editorRef = useRef();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const handleSubmit = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    const uploadedFiles = editorRef.current?.getUploadedImages() || [];
    
    const respBody = {
      title,
      content,
      templateFiles: uploadedFiles
    };

    authFetch(`/management/api/noticeboard/register/${getEmpNo()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(respBody),
    }).then(resp => {
      if (resp.ok) {
      }
    }).catch(err => {
      console.error('공지사항 등록 중 오류 발생:', err);
    }).finally(() => {
      navigate(-1);
    });
  };

  const handleCancel = () => {
    authFetch(`/api/template-delete/${getEmpNo()}`, {
      method: 'DELETE'
    }).then(resp => {
      if (resp.ok) {
      }
    }).catch(err => {
    }).finally(() => {
      navigate(-1);
    });
  };

  return (
    <Box height="calc(100vh - 130px)" sx={{ p: 2, userSelect: 'none' }}>
      <Typography sx={{ fontWeight: 900, fontSize: '1.5em' }} gutterBottom>공지사항 등록</Typography>
      <Divider />
      <Box sx={{ width: '100%', height: 'calc(100% - 130px)', display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
        <TextField label="제목" variant="outlined" value={title} size='small' onChange={e => setTitle(e.target.value)} fullWidth />
        <EditorToolbar ref={editorRef} value={content} onChange={setContent} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>등록</Button>
        <Button variant="outlined" color="error" onClick={handleCancel}>취소</Button>
      </Box>
    </Box>
  );
};

export default ManagementNoticeBoardInsert;
