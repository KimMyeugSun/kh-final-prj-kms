import React from 'react';
import { styled } from '@mui/material/styles';
import ResultItem from './ResultItem';

const List = styled('ol')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'grid',
  gap: 30,
});

export default function ResultList({ items, onItemClick }) {
  return (
    <List>
      {items.map((it, idx) => (
        <ResultItem
          key={`${it.name}-${idx}`}
          idx={idx}
          name={it.name}
          sub={it.sub}
          kcal={it.kcal}
          onClick={() => onItemClick?.(it.name)}
        />
      ))}
    </List>
  );
}
