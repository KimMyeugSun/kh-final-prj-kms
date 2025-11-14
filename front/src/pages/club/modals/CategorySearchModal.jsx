import React from 'react';
import Modal from '../../../components/commons/Modal';
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Button,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CategorySearchModal = ({ open, onClose, query, results = [] }) => {
  const navigate = useNavigate();

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose?.();
      }}
      size="md"
      sx={{ p: 3, width: 800, maxWidth: '92vw' }}
    >
      <Box>
        <Typography variant="h6">검색 결과: "{query}"</Typography>
        <Divider sx={{ my: 2 }} />
        {results.length === 0 ? (
          <Typography variant="body2">검색 결과가 없어요.</Typography>
        ) : (
          <List>
            {results.map((r) => (
              <ListItem
                key={r.no}
                button
                onClick={() => {
                  navigate(`/club/search/${r.no}`);
                  onClose();
                }}
              >
                <Stack flexDirection={'row'}>
                  <Typography variant="subtitle1">{r.name}</Typography>
                  &nbsp;&nbsp;&nbsp;
                  <Typography variant="caption" alignContent={'center'}>
                    {r.leaderName} • {r.updateAt}
                  </Typography>
                  &nbsp;&nbsp;&nbsp;
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
                </Stack>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Modal>
  );
};

export default CategorySearchModal;
