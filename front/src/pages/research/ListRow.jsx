import { Box, Typography, Button } from '@mui/material';

const RightListRow = ({ no, title, onOpen }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '5px',
      marginBottom: '5px',
    }}
  >
    <Typography variant="body1">{title}</Typography>
    <Button size="small" color="primary" onClick={() => onOpen?.(no)}>
      검사하기
    </Button>
  </Box>
);

export default RightListRow;
