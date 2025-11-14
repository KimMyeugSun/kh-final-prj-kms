import React from 'react';
import Modal from '../../../components/commons/Modal';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';

const ClubSearchModal = ({
  open,
  onClose,
  onSelect,
  query = '',
  rows = [],
  loading,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      sx={{ p: 3, width: 800, maxWidth: '92vw' }}
    >
      <Box>
        {query.length !== 0 ? (
          <Typography variant="h6">검색 결과: "{query}"</Typography>
        ) : (
          <Typography variant="h6">모든 결과</Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
            <CircularProgress />
          </Box>
        ) : rows.length === 0 ? (
          <Typography variant="body2">검색 결과가 없어요.</Typography>
        ) : (
          <List>
            {rows.map((r, idx) => (
              <ListItem key={r.no ?? idx} disablePadding>
                <ListItemButton>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="body2">제목 : {r.title}</Typography>
                    <Typography variant="body2">
                      {' '}
                      - 작성자 : {r.writerName}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        onSelect?.(r); // 부모에 선택 데이터 전달
                        onClose(); // 모달 닫기
                      }}
                    >
                      선택
                    </Button>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Modal>
  );
};

export default ClubSearchModal;
