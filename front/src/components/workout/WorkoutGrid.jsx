import React from 'react';
import { styled } from '@mui/material/styles';

const Grid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: 24,
  marginTop: 16,
});

const Tile = styled('button')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  height: 140,
  borderRadius: 12,
  boxShadow: theme.shadows[2],
  cursor: 'pointer',
  fontSize: 16,
  fontWeight: 500,
  '&:hover': { transform: 'translateY(-3px)', boxShadow: theme.shadows[4] },
}));

export default function WorkoutGrid({ items, onSelect }) {
  return (
    <Grid>
      {items.map((name) => (
        <Tile key={name} onClick={() => onSelect(name)}>
          {name}
        </Tile>
      ))}
    </Grid>
  );
}
