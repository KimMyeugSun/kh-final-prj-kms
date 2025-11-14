import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Header from '../components/commons/Header';
import Modal from '../components/commons/Modal';
import KakaoMap from '../components/KakaoMap';
import Setting from '../components/Setting';
import Sidebar from '../components/commons/Sidebar';
import { Outlet } from 'react-router-dom';
import generalMenuList from '../components/commons/menu/GeneralMenuList';
import NotificationList from '../components/widgets/notification/NotificationList';
import { useSelector } from 'react-redux';
import {
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Slider,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

const STORAGE_KEY = 'app.sidebarOpen';

const MainLayout = () => {
  const notifications = useSelector((state) => state.notification.packet);

  const [openSearchMap, setOpenSearchMap] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(() => [
    { value: mapFilter[1].value, color: mapFilter[1].color }, //!< 병원
    { value: mapFilter[2].value, color: mapFilter[2].color }, //!< 의원
    { value: mapFilter[4].value, color: mapFilter[4].color }, //!< 한방병원
    { value: mapFilter[5].value, color: mapFilter[5].color }, //!< 한의원
    { value: mapFilter[6].value, color: mapFilter[6].color }, //!< 치과병원
    { value: mapFilter[7].value, color: mapFilter[7].color }, //!< 치과의원
    { value: mapFilter[8].value, color: mapFilter[8].color }, //!< 보건소
  ]);//!< 약국은 기본적으로 계속 출력 처리

  const [radiusValue, setRadiusValue] = useState(200);
  // 초기값 로컬스토리지에서 복원
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw !== null) setSidebarOpen(raw === 'true');
    } catch (e) {
      // ignore
    }
  }, []);

  // 상태 변경 시 로컬스토리지에 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, sidebarOpen ? 'true' : 'false');
    } catch (e) {
      // ignore
    }
  }, [sidebarOpen]);

  const handleToggleSidebar = (next) => {
    if (typeof next === 'boolean') setSidebarOpen(next);
    else setSidebarOpen((v) => !v);
  };

  const handleFilterToggle = (value) => {
    setSelectedFilters((prev) => {
      const exists = prev.some((f) => f.value === value);
      if (exists) return prev.filter((f) => f.value !== value);
      return [...prev, { value, color: mapFilter.find((f) => f.value === value).color }];
  });
  };
  
  const renderMapFilter = () => {
    return mapFilter.map((filter, index) => {
      const checked = selectedFilters.some((f) => f.value === filter.value);
      return (
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={checked}
              onChange={() => handleFilterToggle(filter.value)}
            />
          }
          // 라벨에 선택 색상 언더라인 적용
          label={<FilterLabel checked={checked} ulineColor={filter.color}>{filter.label}</FilterLabel>}
          key={`${filter.label}-${index}`}
        />
      );
    });
  };

  return (
    <RootContainer>
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} onOpenNotification={() => setOpenNotification(true)} />
      <NotificationList open={openNotification} setOpen={setOpenNotification} notifications={notifications} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onOpen={() => setSidebarOpen(true)} onOpenSearchMapModal={() => setOpenSearchMap(true)} menuList={generalMenuList}/>

      <MainContent open={sidebarOpen}>
        <Box sx={{ p: 2 }}>
          <Outlet />
        </Box>
      </MainContent>

      <Modal open={openSearchMap} onClose={() => setOpenSearchMap(false)} size="md" sx={{ width: 800, maxWidth: '92vw', padding: 0 }} caption={'병원 위치 검색'}>
        <Box sx={{ width: '100%', height: '100%', gap: 2 }}>
          <FormGroup row>{renderMapFilter()}</FormGroup>
          <Box>
            <PrettoSlider
              value={radiusValue}
              onChange={(e, v) => setRadiusValue(typeof v === 'number' ? v : parseFloat(v))}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => {
                const n = Number(v);
                if (Number.isNaN(n)) return '';
                return n >= 1000 ? `${(n/1000).toFixed(1)}km` : `${n}m`;
              }}
              min={200}//200m
              max={1000} //1km
            />
            <Typography variant="body2" color="textSecondary">
              반경: {radiusValue >= 1000 ? `${(radiusValue/1000).toFixed(1)}km` : `${radiusValue}m`}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <KakaoMap selectedFilters={selectedFilters} radiusValue={radiusValue} />
        </Box>
      </Modal>
      
      <Modal open={openSetting} onClose={() => setOpenSetting(false)} size="md">
        <Setting />
      </Modal>
    </RootContainer>
  );
};

const RootContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const MainContent = styled('main')(({ theme, open }) => ({
  flex: 1,
  transition: 'margin 240ms ease, padding-top 240ms ease',
  paddingTop: 'var(--header-height)',
  marginLeft: open ? 'var(--drawer-width)' : 'var(--mini-width)',
  minHeight: 'calc(100vh - var(--header-height))',
}));

const mapFilter = [
  { label: '종합병원', value: 'A', color: '#1976d2' },
  { label: '병원', value: 'B', color: '#0288d1' },
  { label: '의원', value: 'C', color: '#2e7d32' },
  { label: '요양병원', value: 'D', color: '#ffb300' },
  { label: '한방병원', value: 'E', color: '#6a1b9a' },
  { label: '한의원', value: 'G', color: '#00796b' },
  { label: '치과병원', value: 'M', color: '#0097a7' },
  { label: '치과의원', value: 'N', color: '#29b6f6' },
  { label: '보건소', value: 'R', color: '#43a047' },
  { label: '기타(구급차)', value: 'W', color: '#fb8c00' },
  { label: '기타', value: 'I', color: '#9e9e9e' },
];

const ToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .Mui-selected': {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: '#fff !important',
    fontWeight: 'bold !important',
  },
  '& .MuiToggleButton-root:hover': {
    backgroundColor: `${theme.palette.primary.light} !important`,
    color: '#fff !important',
  },
}));

const PrettoSlider = styled(Slider)(({ theme }) => ({
  color: `${theme.palette.primary.main}`,
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&::before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 10,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: `${theme.palette.primary.main}`,
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&::before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
}));

// 맨 아래 스타일들 아래/근처에 추가
const FilterLabel = styled('span', {
  shouldForwardProp: (prop) => prop !== 'checked' && prop !== 'ulineColor',
})(({ theme, checked, ulineColor }) => ({
  display: 'inline-block',
  paddingBottom: 2,
  borderBottom: checked ? `3px solid ${ulineColor}` : '3px solid transparent',
  fontWeight: checked ? 700 : 400,
  transition: 'border-color 200ms ease',
}));

export default MainLayout;
