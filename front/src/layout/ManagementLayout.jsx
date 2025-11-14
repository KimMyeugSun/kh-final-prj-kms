import { Box, Button, FormControl, InputLabel, List, ListItemIcon, ListItemText, MenuItem, Select, Stack, styled, TextField, useTheme } from '@mui/material';
import Header from '../components/commons/Header';
import Sidebar from '../components/commons/Sidebar';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ManagementMenusList from '../components/commons/menu/ManagementMenuList';
import NotificationList from '../components/widgets/notification/NotificationList';
import Modal from '../components/commons/Modal';
import authFetch from '../utils/authFetch';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const ManagementLayout = () => {
  const theme = useTheme();
  const [openBroadcast, setOpenBroadcast] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const notifications = useSelector((state) => state.notification.packet);
  const [openNotification, setOpenNotification] = useState(false);
  const initBroadcast = { type: 'normal', title: '', message: '' };
  const [sendBroadcast, setSendBroadcast] = useState(initBroadcast);

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
    // next may be boolean or inverse toggle
    if (typeof next === 'boolean') setSidebarOpen(next);
    else setSidebarOpen((v) => !v);
  };

  const chooseColor = (type) => {    
    switch(type) {
      case 'important':
        return `${theme.palette.warning.light}`;
      case 'urgent':
        return `${theme.palette.error.light}`;
      case 'admin':
        return `${theme.palette.secondary.main}`;
      default:
        return `${theme.palette.primary.light}`;
    }
  };

  const getIcon = (type) => {
    const clr = chooseColor(type);
    switch(type) {
      case 'normal':
        return <NotificationsNoneIcon sx={{ color: clr }}/>;
      case 'important':
        return <WarningAmberIcon sx={{ color: clr }}/>;
      case 'urgent':
        return <ErrorOutlineIcon sx={{ color: clr }}/>;
      case 'admin':
        return <AdminPanelSettingsIcon sx={{ color: clr }}/>;
      default:
        return <NotificationsNoneIcon sx={{ color: clr }}/>;
    }
  };


  const renderNotificationTypeList = () => {
    return NotificationType.map((type) => (
      <MenuItem key={type.code} value={type.code}>
        <ListItemIcon>{getIcon(type.code)}</ListItemIcon>
        <ListItemText>{type.name}</ListItemText>
      </MenuItem>
    ));
  }

  const handleChangeBroadcastInput = (e) => {
    const { name, value } = e.target;
    setSendBroadcast((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeBroadcastModal = () => {
    setOpenBroadcast(false);
    setSendBroadcast(initBroadcast);
  }

  const sendBroadcastMessage = async () => {
    console.log('Sending broadcast message:', sendBroadcast);
    
    try {
      const response = await authFetch('/api/alarm/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendBroadcast),
      });

      if(!response.ok)
        throw new Error('Failed to send broadcast message1');

      const jsondata = await response.json();

      if(!jsondata.success)
        throw new Error('Failed to send broadcast message2', jsondata.msg);
      
      alert(jsondata.msg);
    } catch (error) {
      alert('Error sending broadcast message:', error);
    } finally {
      closeBroadcastModal();
    }
  };

  const renderSelectedValue = (selected) => {
    const selectedType = NotificationType.find(type => type.code === selected);
    if (!selectedType) return '';
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {getIcon(selected)}
        <span>{selectedType.name}</span>
      </Box>
    );
  };

  return (
    <RootContainer>
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        useBroadcast={true}
        onOpenBroadcast={() => setOpenBroadcast(true)}
        onOpenNotification={() => setOpenNotification(true)}
        title="우리건강 지키미 일일구(관리자 페이지)"
      />
      <NotificationList open={openNotification} setOpen={setOpenNotification} notifications={notifications} />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpen={() => setSidebarOpen(true)}
        onOpenSearchMapModal={() => setOpenSearchMap(true)}
        menuList={ManagementMenusList}
      />
      <MainContent open={sidebarOpen}>
        <Box sx={{ p: 2 }}>
          <Outlet />
        </Box>
      </MainContent>

      <Modal open={openBroadcast} onClose={closeBroadcastModal} caption="알람 발송" size="md">
        <Box sx={{ width: '100%', height: '100%', gap: 2 , display: 'flex', flexDirection: 'column', pt: 2, size:"small" }}>
          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel>알림 종류</InputLabel>
            <Select value={sendBroadcast.type} label="알림 종류" name="type" onChange={handleChangeBroadcastInput} renderValue={renderSelectedValue}>
              {renderNotificationTypeList()}
            </Select>
          </FormControl>
          <TextField label="제목" name="title" size="small" onChange={handleChangeBroadcastInput} />
          <TextField label="메시지" name="message" size="small" onChange={handleChangeBroadcastInput} />
          <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 1, width: '100%' }} >
            <Button variant="outlined" color="error" onClick={closeBroadcastModal}>취소</Button>
            <Button variant="contained" color="primary" onClick={sendBroadcastMessage}>발송</Button>
          </Stack>
        </Box>
      </Modal>
    </RootContainer>
  );
};

const RootContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
}));

const MainContent = styled('main')(({ theme, open }) => ({
  flex: 1,
  transition: 'margin 240ms ease, padding-top 240ms ease',
  paddingTop: `var(--header-height)`,
  marginLeft: open ? `var(--drawer-width)` : `var(--mini-width)`,
  minHeight: `calc(100vh - var(--header-height))`,
}));

const NotificationType = [
  {name: '일반 알림', code: 'normal'},
  {name: '중요 알림', code: 'important'},
  {name: '긴급 알림', code: 'urgent'},
  {name: '관리자 알림', code: 'admin'},
]

export default ManagementLayout;
