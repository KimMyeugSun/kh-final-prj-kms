import React from 'react';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

const Bar = styled('div')({
  width: 760,
  margin: '24px auto',
  display: 'grid',
  gridTemplateColumns: '140px 1fr',
  alignItems: 'center',
  columnGap: 16,
  rowGap: 8,
});

const Label = styled('div')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 700,
  height: 36,
  lineHeight: '36px',
}));

const Chips = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 50,
});

const Pill = styled(Chip)({
  borderRadius: 999,
  height: 36,
  backgroundColor: '#F3F4F6',
  '& .MuiChip-label': { lineHeight: '36px' },
  '&:hover': { backgroundColor: '#EDEFF2' },
});

export default function RecentChips({ items, onSelect }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <Bar>
      <Label>최근 검색어</Label>
      <Chips>
        {safeItems.length > 0 ? (
          safeItems.map((w) => (
            <Pill key={w} label={w} onClick={() => onSelect(w)} />
          ))
        ) : (
          <span style={{ color: '#999', fontSize: 14 }}></span>
        )}
      </Chips>
    </Bar>
  );
}
