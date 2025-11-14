import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Collapse,
  Popover, // 추가
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../define/styles/Color';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { StarBorder } from '@mui/icons-material';
import StarIcon from '@mui/icons-material/Star';

const routeMap = {
  dashboard: '/dashboard',
  mypage: '/mypage',
  lifestyle: '/lifestyle',
  ranking: '/ranking',
  club: '/club',
  research: '/research',
  challenge: '/challenge',
  mall: '/mall',
};

const Sidebar = ({
  open = false,
  onClose = () => {},
  onNavigate = null,
  variant = 'persistent',
  onOpenSearchMapModal = () => {},
  menuList = [],
}) => {
  const navigate = useNavigate();
  const location = useLocation(); //!< 현재 경로로 선택 상태 결정
  const currPath = location.pathname;
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [miniPopover, setMiniPopover] = useState({
    menuKey: null,
    anchorEl: null,
  });

  const openMiniPopover = (menuKey, anchorEl) => {
    setMiniPopover({ menuKey, anchorEl });
  };
  const closeMiniPopover = () => {
    if (
      document.activeElement &&
      typeof document.activeElement.blur === 'function'
    ) {
      document.activeElement.blur();
    }

    document.body.focus();
    setMiniPopover({ menuKey: null, anchorEl: null });
  };

  const navigateTo = (actionOrPath) => {
    if (typeof onNavigate === 'function') {
      try {
        onNavigate(actionOrPath);
      } catch (e) {}
      return;
    }

    let path = routeMap[actionOrPath] || actionOrPath || '';
    if (typeof path === 'string' && !path.startsWith('/')) {
      path = '/' + path.replace(/^\/+/, '');
    }

    try {
      navigate(path);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleItemClick = (action) => {
    if (!action) return;

    if (action.type === 'modal') {
      if (action.path === 'map') onOpenSearchMapModal();
      return;
    }

    if (action.type === 'navigate') {
      navigateTo(action.path);
    }
  };

  const resolvePath = (action) => {
    if (!action) return '';
    if (action.type !== 'navigate') return '';
    return routeMap[action.path] || action.path || '';
  };

  const renderMenu = () => {
    return menuList.map((item) => {
      const { action, label, icon, useDivider, children } = item;
      const path = resolvePath(action);
      const isActive =
        path && (currPath === path || currPath.startsWith(path + '/'));

      const childActive =
        Array.isArray(children) &&
        children.some((sub) => {
          const subPath = resolvePath(sub.action);
          return (
            subPath &&
            (currPath === subPath || currPath.startsWith(subPath + '/'))
          );
        });

      const menuKey = `${label}-${action.type}-${action.path || ''}`;

      return (
        <React.Fragment key={menuKey}>
          <ListItemButton
            onClick={() => {
              if (children && children.length) {
                setOpenSubmenu(menuKey);
                const first = children[0];
                if (!first) return;
                if (first.action?.type === 'navigate') {
                  navigateTo(first.action.path);
                } else {
                  handleItemClick(first.action);
                }
              } else {
                setOpenSubmenu(null);
                handleItemClick(action);
              }
            }}
            selected={isActive || childActive}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
            {children && children.length ? (
              openSubmenu === menuKey || childActive ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )
            ) : null}
          </ListItemButton>

          {children && children.length ? (
            <Collapse
              in={openSubmenu === menuKey || childActive}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {children.map((sub) => {
                  const subPath = resolvePath(sub.action);
                  const subActive = currPath.includes(subPath);

                  return (
                    <ListItemButton
                      key={`${label}-child-${sub.label}-${sub.action.type}-${
                        sub.action.path || ''
                      }`}
                      sx={{
                        pl: 4,
                        '& .MuiListItemText-root': { width: '100%' },
                      }}
                      onClick={() => handleItemClick(sub.action)}
                      selected={subActive}
                    >
                      <ListItemIcon>
                        {subActive ? <StarIcon /> : <StarBorder />}
                      </ListItemIcon>
                      <ListItemText primary={sub.label} />
                    </ListItemButton>
                  );
                })}
              </List>
            </Collapse>
          ) : null}

          {useDivider ? <Divider /> : null}
        </React.Fragment>
      );
    });
  };
  const renderMiniMenu = () => {
    return menuList.map(({ action, label, icon, useDivider, children }) => {
      const path = resolvePath(action);
      const isActive =
        path && (currPath === path || currPath.startsWith(path + '/'));
      const menuKey = `mini-${label}-${action.type}-${action.path || ''}`;
      const hasChildren = Array.isArray(children) && children.length > 0;

      return (
        <React.Fragment key={menuKey}>
          <Box
            onMouseEnter={(e) => {
              if (hasChildren) openMiniPopover(menuKey, e.currentTarget);
            }}
            onMouseLeave={(e) => {}}
          >
            <Tooltip title={label} placement="right">
              <IconButton
                color={isActive ? 'primary' : 'inherit'}
                onClick={(e) => {
                  if (hasChildren) {
                    // 클릭 시 토글
                    if (miniPopover.menuKey === menuKey) closeMiniPopover();
                    else openMiniPopover(menuKey, e.currentTarget);
                  } else {
                    handleItemClick(action);
                  }
                }}
                size="large"
              >
                {icon}
              </IconButton>
            </Tooltip>

            {hasChildren ? (
              <Popover
                open={miniPopover.menuKey === menuKey}
                anchorEl={miniPopover.anchorEl}
                onClose={closeMiniPopover}
                anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
                transformOrigin={{ vertical: 'center', horizontal: 'left' }}
                disableRestoreFocus
                paper={{
                  sx: { pointerEvents: 'auto', p: 0, minWidth: 160 },
                }}
              >
                <List
                  onMouseLeave={closeMiniPopover}
                  sx={{ py: 0 }}
                  component="nav"
                >
                  {children.map((sub) => {
                    const subPath = resolvePath(sub.action);
                    const subActive = currPath.includes(subPath);
                    return (
                      <ListItemButton
                        key={`${label}-child-${sub.label}-${sub.action.type}-${
                          sub.action.path || ''
                        }`}
                        onClick={() => {
                          handleItemClick(sub.action);
                          closeMiniPopover();
                        }}
                        selected={subActive}
                        sx={(theme) => ({
                          justifyContent: 'center',
                          pl: 2, //!< padding left
                          pr: 2, //!< padding right
                          color: theme.palette.text.secondary,
                        })}
                      >
                        <ListItemText primary={sub.label} />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Popover>
            ) : null}
          </Box>

          {useDivider ? <Divider /> : null}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {open ? (
        <Drawer
          anchor="left"
          open={open}
          onClose={onClose}
          variant={variant}
          slotProps={{
            paper: {
              sx: (theme) => ({
                width: 'var(--drawer-width)',
                boxSizing: 'border-box',
                mt: 'var(--header-height)',
                height: `calc(100% - var(--header-height))`,
                zIndex: theme.zIndex.appBar - 1,
                backgroundColor: colors.white,
                // boxShadow: theme.shadows[4],
                borderRight: `1px solid ${theme.palette.divider}`,
              }),
            },
          }}
          paper={{
            sx: (theme) => ({
              width: 'var(--drawer-width)',
              boxSizing: 'border-box',
              mt: 'var(--header-height)',
              height: `calc(100% - var(--header-height))`,
              zIndex: theme.zIndex.appBar - 1,
              // boxShadow: theme.shadows[4],
              borderRight: `1px solid ${theme.palette.divider}`,
            }),
          }}
        >
          <Box sx={{ p: 1, userSelect: 'none' }}>
            <List>{renderMenu()}</List>
          </Box>
        </Drawer>
      ) : (
        <MiniBar role="navigation" aria-label="mini sidebar">
          {renderMiniMenu()}
        </MiniBar>
      )}
    </>
  );
};

const MiniBar = styled(Box)(({ theme }) => ({
  width: 'var(--mini-width)',
  boxSizing: 'border-box',
  position: 'fixed',
  top: 'var(--header-height)',
  left: 0,
  bottom: 0,
  background: colors.white, //!< 미니바 배경색
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: theme.spacing(1),
  zIndex: theme.zIndex.appBar - 1,
  // boxShadow: theme.shadows[4],
  '& > *': {
    marginBottom: theme.spacing(1),
  },
  userSelect: 'none',
}));

export default Sidebar;
