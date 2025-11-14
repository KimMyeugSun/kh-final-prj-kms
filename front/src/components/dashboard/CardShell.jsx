import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  height: '100%',
}));

export default function CardShell({ title, children, sx, contentSx }) {
  return (
    <Card sx={sx}>
      {title && (
        <>
          <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
            {title}
          </Typography>
          <Divider sx={{ my: 1.5 }} />
        </>
      )}

      {/* ✅ contentSx로 내용 부분만 따로 스타일 가능 */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          ...contentSx,
        }}
      >
        {children}
      </Box>
    </Card>
  );
}
