import React, { useEffect, useRef, useState } from 'react';

import Profile from '../../../components/Profile';
import { Box, Button, Chip, CircularProgress, Stack, styled, Tooltip, Typography } from '@mui/material';
import { makeImgProfileUrl } from '../../../utils/makeUrl';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ChangePassword from './ChangePassword';
import authFetch from '../../../utils/authFetch';
import { useAuth } from '../../../auth/useAuth';

const MyPageProfile = () => {
  const { rawUser, setUser, getEmpNo } = useAuth();
  const [isChgPwdModal, setIsChgPwdModal] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    authFetch(`/api/emp-tag/${getEmpNo()}`)
    .then((data) => {
      if (!data.ok) throw new Error('태그 조회 실패');
      return data.json();
    })
    .then((jsondata) => {
      const tagDatas = jsondata?.data?.tags;
      if (!tagDatas) throw new Error('태그 데이터 없음');
      setTags(tagDatas);
    }).finally(() => { setLoading(false); });
  }, []);

  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

    const handleProfileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const doChangeProfile = () => {
    if (!selectedFile) return;

    const reqBody = new FormData();
    reqBody.append('profile', selectedFile);

    authFetch(`/api/employee/profile/${getEmpNo()}`,{
      method: 'POST',
      body: reqBody,
    }).then(resp => {
      if(!resp.ok) throw new Error('프로필 사진 변경에 실패했습니다.');
      return resp.json();
    }).then(jsondata => {
      if(!jsondata.success) throw new Error(jsondata.msg || '프로필 사진 변경에 실패했습니다.');
      const data = jsondata.data;
      if(!data) throw new Error('프로필 사진 변경에 실패했습니다.');

      const user = { ...rawUser };
      user.employee.empProfileName = data.empProfileName;
      
      setUser(user);
    }).catch(err => {
      console.error(err);
      alert('프로필 사진 변경 중 오류가 발생했습니다.');
    }).finally(() => {
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    });
  };

  const renderTag = () => {
    if(!Array.isArray(tags) || tags.length === 0) 
      return <Chip label="없음" color="default" size="small" />;

    return tags.map((tag, index) => (
      <Chip key={index} label={tag} color="info" size="small" />
    ));
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', userSelect: 'none' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 180 }}>
        <Profile url={selectedFile ? URL.createObjectURL(selectedFile) : makeImgProfileUrl(rawUser?.employee?.empProfileName)} name={rawUser?.name} w={150} h={150} fs={75} onClick={handleProfileClick} />
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfileChange} />
        {selectedFile && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button variant="contained" color="primary" size="small" sx={{mr:1}} onClick={doChangeProfile}>적용</Button>
            <Button variant="outlined" color="error" size="small" onClick={() => {setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = null;}}>취소</Button>
          </Box>
        )}
      </Box>
      <Box sx={{ ml: 4, flex: 1 }}>
        <InfoRow variant="h5" color="theme.palette.text.primary" ml={1} display={'inline'}>'{rawUser?.name}'</InfoRow>
        <InfoRow variant="h6" display={'inline'}> {rawUser?.employee?.empDepartment} </InfoRow>
        <InfoRow variant="subtitle1" display={'inline'}>{rawUser?.employee?.empPosition}</InfoRow>
        <InfoRow>복지포인트: {Number(rawUser?.employee?.empWelfarePoints || 0).toLocaleString()}점</InfoRow>
        <InfoRow>전화번호: {rawUser?.employee?.empPhone || ''}</InfoRow>
        <InfoRow>EMail: {rawUser?.employee?.empEmail || ''}</InfoRow>
        <InfoRow>주소: {rawUser?.employee?.empAddress || ''} {rawUser?.employee?.empAddressDetail || ''}</InfoRow>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1.5 }}>
          {renderTag()}
        </Stack>
        <Tooltip title="비밀번호 변경" placement='top' color='primary'>
          <Button variant="contained" size="small" sx={{ mt: 2, mr: 1 }} display={'inline'} onClick={() => setIsChgPwdModal(true)}>
            <VpnKeyIcon fontSize="small" sx={{ mr: 0.5 }} />
            비밀번호 변경
          </Button>
        </Tooltip>
      </Box>

      {loading && (
        <Box sx={{
          position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20
        }}>
          <CircularProgress />
        </Box>
      )}

      <ChangePassword isOpen={isChgPwdModal} setModalCtrl={setIsChgPwdModal} />
    </Box>
  );
};

const InfoRow = styled(Typography)(({ theme, variant, color, display, mb, ml}) => ({
  variant: variant || "body1",
  color: color || theme.palette.text.secondary,
  fontWeight: 'bold',
  marginLeft: ml || 0,
  marginBottom: mb || 2,
  display: display || 'block',
}));

export default MyPageProfile;