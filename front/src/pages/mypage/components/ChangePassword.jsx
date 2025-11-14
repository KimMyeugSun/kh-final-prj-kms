import React, { use, useEffect, useState } from 'react';
import Modal from '../../../components/commons/Modal';
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import authFetch from '../../../utils/authFetch';
import { useAuth } from '../../../auth/useAuth';

const ChangePassword = ({ isOpen, setModalCtrl }) => {
  const { getEmpNo } = useAuth();
  const [showAlertMsg, setShowAlertMsg] = useState(null);
  const [validatePwd, setValidatePwd] = useState({
    newPwd: '',
    confirmPwd: ''
  });  

  const [showPwd, setShowPwd] = useState(false);
  const [fetchBody, setFetchBody] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    setFetchBody({
      prevPwd: formData.get('prevPwd'),
      newPwd: formData.get('newPwd'),
    });
  };

  useEffect(() => {
    if(fetchBody == null || Object.keys(fetchBody).length === 0) return;
    onChangePwd();
  }, [fetchBody]);

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    
    setValidatePwd((prev) => ({ ...prev, [key]: value }));
  }

  const isValidNewPwd = () => {
    if(validatePwd.newPwd === '' || validatePwd.newPwd === undefined) return false;

    return validatePwd.newPwd === validatePwd.confirmPwd;
  }

  const close = () => {
    setModalCtrl(false);
    setValidatePwd({
      newPwd: '',
      confirmPwd: ''
    });
    setShowPwd(false);
  }

  const onChangePwd = () => {
    authFetch(`/api/change-password/${getEmpNo()}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fetchBody)
    })
    .then((resp) => {
      if (!resp.ok) return resp.json().then((data) => { throw new Error(data.errorMsg || '비밀번호 변경에 실패했습니다.'); });

      close();
    })
    .catch(error => {
      setShowAlertMsg({ type: 'error', message: error.message});
    })
  }

  return (
    <>
      <Modal open={isOpen} onClose={close} caption="비밀번호는 정기적으로 변경하는 것을 권장합니다.">
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }}>
          <Typography variant="h8">
            비밀번호 확인
            <IconButton aria-label={showPwd ? 'Hide pwd' : 'Show pwd'} onClick={() => setShowPwd((prev) => !prev)}>
              {showPwd ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Typography>
        </Box>
        <Box onSubmit={handleSubmit} component="form" noValidate autoComplete="off" >
          {/* 사용자 이름 (숨김) - 경고방지 */}
          <input type="text" name="username" autoComplete="username" style={{ display: 'none' }} readOnly />
          <FormControl fullWidth margin="normal" variant="outlined" required>
            <InputLabel htmlFor="prevPwd">기존 비밀번호</InputLabel>
            <OutlinedInput name="prevPwd" type={showPwd ? 'text' : 'password'} label="기존 비밀번호" autoComplete="current-password"/>
          </FormControl>

          <FormControl fullWidth margin="normal" variant="outlined" required>
            <InputLabel htmlFor="newPwd">새 비밀번호</InputLabel>
            <OutlinedInput name="newPwd" type={showPwd ? 'text' : 'password'} onChange={handleChange('newPwd')} label="새 비밀번호" autoComplete="new-password" />
          </FormControl>

          <FormControl fullWidth margin="normal" variant="outlined" required>
            <InputLabel htmlFor="confirm-newPwd">새 비밀번호 확인</InputLabel>
            <OutlinedInput name="confirm-newPwd" type={showPwd ? 'text' : 'password'} onChange={handleChange('confirmPwd')} label="새 비밀번호 확인" autoComplete="new-password" />
          </FormControl>
          {validatePwd.newPwd.length > 0 && (
          <Typography variant="body2" color={isValidNewPwd() ? 'primary' : 'error'}>
            {isValidNewPwd() ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
          </Typography>)}
          <Box sx={{display: 'flex', gap: 1, mt: 2 }}> 
            <Button type="button" variant="contained" color="error" fullWidth onClick={close}>취소</Button>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={!isValidNewPwd()}>변경</Button>
          </Box>
        </Box>
        {showAlertMsg !== null && (
        <Alert severity={showAlertMsg.type} sx={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 1300 }} onClose={() => setShowAlertMsg(null)} >
          {showAlertMsg.message}
        </Alert>
      )}
      </Modal>
      
    </>
  );
};

export default ChangePassword;
