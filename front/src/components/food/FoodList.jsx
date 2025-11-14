import React from 'react';
import FoodItem from './FoodItem';

export default function FoodList({ items, onItemClick }) {
  return (
    <ol
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'grid',
        gap: 30,
      }}
    >
      {items.map((it, idx) => (
        <FoodItem
          key={`${it.name}-${idx}`}
          idx={idx}
          name={it.name}
          serving={it.serving}
          kcal={it.kcal}
          onClick={() => onItemClick?.(it.name)}
        />
      ))}
    </ol>
  );
}
