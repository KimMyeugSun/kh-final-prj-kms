import React from 'react';
import { styled } from '@mui/material/styles';

const Wrapper = styled('section')(({ theme }) => ({
  width: 960,
  margin: '0 auto',
  background: '#FAF6EE',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  padding: 40,
}));

export default function SectionCard({ title, children }) {
  return (
    <Wrapper>
      {title && (
        <h3
          style={{ margin: 0, marginBottom: 24, fontSize: 20, fontWeight: 900 }}
        >
          {title}
        </h3>
      )}
      {children}
    </Wrapper>
  );
}
