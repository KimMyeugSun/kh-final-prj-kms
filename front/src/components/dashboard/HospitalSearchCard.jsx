import React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CardShell from './CardShell';

export default function HospitalSearchCard() {
  return (
    <CardShell
      title="병의원 / 약국 찾기"
      contentSx={{
        justifyContent: 'center',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <TextField fullWidth size="small" placeholder="병원명 / 약국 찾기" />
        <Button
          variant="contained"
          disableElevation
          sx={{ px: 1, fontWeight: 700 }}
        >
          검색
        </Button>
      </Stack>
    </CardShell>
  );
}
