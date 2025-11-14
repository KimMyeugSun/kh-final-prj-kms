import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, useTheme } from '@mui/material';
import React, { useState } from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { removeNotification } from '../../../redux/notificationSlice';
import { useNotification } from '../../../notificationManager/NotificationManager';
import { useAuth } from '../../../auth/useAuth';
import { useDispatch } from 'react-redux';


const NotificationList = ({ open, setOpen, notifications }) => {
  const theme = useTheme();
  const { sendNotification } = useNotification();
  const { getEmpNo } = useAuth();
  const dispatch = useDispatch();

  const chooseIcon = (type) => {
    const clr = chooseColor(type);
    switch(type) {
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

  const handleClick = (notification) => {
    const packet = { nno: notification.nno, eno: getEmpNo() };

    sendNotification('/pub/done', packet);
    dispatch(removeNotification(notification));
  }  

  const DrawerList = (
    <Box sx={{ width: 250, p: 1 }} role="presentation">
      <List>
        {notifications.map((notification) => (
          <TagListItem key={notification.nno} disablePadding sx={{ mb: 1, borderRadius: 1 }} color={chooseColor(notification.notificationType)}>
            <ListItemButton onClick={() => handleClick(notification)}>
              <ListItemIcon>
                {chooseIcon(notification.notificationType)}
              </ListItemIcon>
              <NotificatoinText primary={notification.title} secondary={notification.message} />
            </ListItemButton>
          </TagListItem>
        ))}
      </List>      
    </Box>
  );

  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor='right'>
      {DrawerList}
    </Drawer>
  );
};

const NotificatoinText = styled(ListItemText)({
  // '& .MuiListItemText-primary': { color: '#fff', fontWeight: 'bold' },      // 제목 색상
  // '& .MuiListItemText-secondary': { color: '#fff' },    // 메시지 색상
});

const TagListItem = styled(ListItem)(({ theme, color }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    width: 8, // 바의 두께
    height: '100%',
    backgroundColor: color || theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
  },
  border: `1px solid ${theme.palette.divider}`,
}));

export default NotificationList;