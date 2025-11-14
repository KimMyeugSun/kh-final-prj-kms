import React, { useEffect } from 'react';
import { IconButton, Badge, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import VisitorInfo from './VisitorInfo';
import { colors } from '../../define/styles/Color';
import { useAuth } from '../../auth/useAuth';
import { useSelector } from 'react-redux';

const Header = ({
  sidebarOpen = false,
  onToggleSidebar = () => {},
  useBroadcast = false,
  onOpenBroadcast = () => {},
  onOpenNotification = () => {},
  title = '우리건강 지키미 일일구',
}) => {
  const { getEmpNo } = useAuth();
  const favicon = '/favicons/favicon-32x32.png';  

  const notification = useSelector(state => state.notification.packet);
  const notificationCount = notification.length;

  const handleToggle = () => {
    if (typeof onToggleSidebar === 'function') onToggleSidebar(!sidebarOpen);
  };

  const shortCutMenu = [
    ...(useBroadcast?[{
      label: '메시지브로드케스트',
      icon: <RecordVoiceOverIcon />,
      onClick: () => {
        if (typeof onOpenBroadcast === 'function') onOpenBroadcast();
      },
    }] : []),
    {
      label: '알림',
      icon: (
        <Badge badgeContent={notificationCount} color="error">
          <NotificationsIcon />
        </Badge>
      ),
      onClick: () => {
        if(typeof onOpenNotification === 'function') onOpenNotification();
      },
    },
  ];

  const renderShortCutMenu = () => {
    return shortCutMenu.map((item, index) => (
      <IconButton key={index} onClick={() => handleShortCutClick(item)}>
        {item.icon}
      </IconButton>
    ));
  };

  const handleShortCutClick = (item) => {
    if (item.onClick && typeof item.onClick === 'function') {
      item.onClick();
    }
  };

  return (
    <HeaderContainer>
      <Left>
        <ToggleButton
          aria-label="toggle sidebar"
          color="inherit"
          onClick={handleToggle}
          size="large"
          data-open={sidebarOpen}
        >
          {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </ToggleButton>
        <CI src={favicon} alt="Favicon" />
        {/* <Title>{title}</Title> */}
        <Typography sx={{ fontWeight: 900, fontSize: '1.5em', marginLeft: 1 }}>{title}</Typography>
      </Left>

      <Right>
        <VisitorInfo />
        {renderShortCutMenu()}
      </Right>
    </HeaderContainer>
  );
};

// 토글 버튼 위치는 고정(left 고정 값), 헤더 레이아웃과 독립
const ToggleButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  // 헤더 중앙 기준으로 토글 높이(28px)를 맞춰서 배치
  top: `calc(var(--header-height) / 2 - 14px)`,

  left: 12,
  width: 28,
  height: 28,
  padding: 4,
  zIndex: theme.zIndex.appBar + 20,
  background: 'transparent',
  '&:hover': { background: theme.palette.action.hover },
  // 시각적 정렬용으로 transform 사용하면 렌더링이 선명함
  transform: 'translateZ(0)',
}));

// const Title = styled('h1')`
//   color: ${({ theme }) => theme.palette.text.primary};
//   margin: 0 0 0 8px;
//   font-size: 1.5em;
//   font-weight: 900;
// `;

/* Header는 항상 전체 폭을 차지하되 사이드바 상태에 따른 패딩 변경 없음 */
const HeaderContainer = styled('header')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: `var(--header-height)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: colors.white,
  zIndex: theme.zIndex.appBar + 1,
  borderBottom: `1px solid ${theme.palette.divider}`,
  userSelect: 'none',
}));

// Left에 고정 margin-left를 토글 크기에 맞게 조정
const Left = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 48, // left(12) + toggle width(28) + 간격(~8) = 48
});

const Right = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginRight: 10,
});

const CI = styled('img')({
  width: 24,
  height: 24,
  borderRadius: '50%',
  marginLeft: 0,
});

export default Header;
