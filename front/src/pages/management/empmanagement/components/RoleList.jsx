import {
  Box,
  Chip,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import { ROLE_COLOR } from '../../../../define/RoleColor';

/**
 * 권한 목록 컴포넌트 
 * @param {string} title 제목
 * @param {string[]} fullList 전체 권한 목록
 * @param {string[]} selectedGranted 선택된 권한 목록
 * @param {function} setSelectedGranted 선택된 권한 목록 설정 함수
 * @returns
 */
const RoleList = ({ title, fullList, selectedGranted, setSelectedGranted }) => {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <List
        dense
        sx={{ border: '1px solid #eee', borderRadius: 1, minHeight: 200 }}
      >
        {fullList.map((role) => (
          <ListItem key={role} disablePadding>
            <ListItemButton selected={selectedGranted.includes(role)}
              onClick={() => {
                setSelectedGranted(
                  selectedGranted.includes(role)
                    ? selectedGranted.filter((r) => r !== role)
                    : [...selectedGranted, role]
                );
              }}
              sx={{ p: 1 }}
            >
              <Chip label={role} color={ROLE_COLOR[role] || 'default'} size="small" sx={{ mr: 1 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RoleList;
