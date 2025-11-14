import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function CategoryTabs({ value, onChange, categories }) {
  return (
    <Tabs
      value={value}
      onChange={(_, v) => onChange(v)}
      variant="fullWidth"
      textColor="inherit"
      sx={{
        mb: 1,
        '& .MuiTab-root': {
          flex: 1,
          fontWeight: 800,
          fontSize: 18,
          minHeight: 44,
        },
        '& .MuiTabs-indicator': {
          backgroundColor: '#4687ff',
          height: 3,
          borderRadius: 2,
        },
      }}
    >
      {categories.map((c) => (
        <Tab key={c} value={c} label={c} />
      ))}
    </Tabs>
  );
}
