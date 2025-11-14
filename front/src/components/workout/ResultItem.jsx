import React from 'react';
import { styled } from '@mui/material/styles';

const Row = styled('li')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '56px 1fr 120px',
  alignItems: 'center',
  width: 760,
  margin: '0 auto',
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  padding: '14px 16px',
  cursor: 'pointer',
}));

const Rank = styled('div')({ justifySelf: 'center', fontWeight: 800 });
const NameBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  '& .name': {
    fontWeight: 800,
    color: theme.palette.text.primary,
  },
  '& small': {
    display: 'block',
    marginTop: 2,
    fontSize: 12,
    lineHeight: '18px',
    color: theme.palette.text.secondary,
  },
}));
const Kcal = styled('div')({ justifySelf: 'end', fontWeight: 700 });

export default function ResultItem({ idx, name, sub, kcal, onClick }) {
  return (
    <Row onClick={onClick} role="button">
      <Rank>{idx + 1}</Rank>
      <NameBox>
        <span className="name">{name}</span>
        <small>{sub}</small>
      </NameBox>
      <Kcal>{kcal}kcal</Kcal>
    </Row>
  );
}
