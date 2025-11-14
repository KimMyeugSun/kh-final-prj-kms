import React, { useState } from 'react';
import {
  Typography,
  Box,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import Profile from '../Profile';
import { makeImgProfileUrl } from '../../utils/makeUrl';

const VisitorInfo = () => {
  const location = useLocation();
  const { rawUser, signOut, hasAccessToManagement } = useAuth();
  const userName = rawUser?.name;
  const avatarSrc = rawUser?.employee?.empProfileName ? makeImgProfileUrl(rawUser?.employee?.empProfileName) : null; // 사용자 아바타 이미지 URL (없으면 null)
  const points = rawUser?.employee.empWelfarePoints; // 예시 포인트 값

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const onPopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
  // body로 포커스 이동
    document.body.focus();
    setAnchorEl(null);
  };

  const handleMyPage = () => {
    handleClose();
    navigate('/mypage/health-checkup-history');
  };

  const handleLogout = () => {
    handleClose();
    signOut(location);
  };

  //!< 관리자 페이지 접근 권한이 있으면, VisitorInfo 대신에 간단한 로그아웃 버튼만 표시
  if (hasAccessToManagement())
    return (
      <Container>
        <Button onClick={handleLogout} sx={{ color: '#fff' }}>로그아웃</Button>
      </Container>
    );

  return (
    <>
      <Container onClick={onPopup}>
        <Left>
          <Profile url={avatarSrc} name={userName} w={32} h={32} size={32} />
          <Name>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
              {userName}
            </Typography>
          </Name>
        </Left>

        <PointsBox>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
            {Number(points).toLocaleString()} pt
          </Typography>
        </PointsBox>
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableRestoreFocus
      >
        <MenuItem onClick={handleMyPage}>마이페이지</MenuItem>
        <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
      </Menu>
    </>
  );
};

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  cursor: 'pointer',
  backgroundColor: theme.palette.primary.main,
  padding: '6px 10px',
  borderRadius: 12,
  boxShadow: theme.shadows[1],
}));

const Left = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}));

const Name = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}));

const PointsBox = styled('div')(({ theme }) => ({
  marginLeft: '8px',
  //
}));

export default VisitorInfo;
