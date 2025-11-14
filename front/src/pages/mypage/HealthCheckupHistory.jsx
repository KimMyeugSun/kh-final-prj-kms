import React, { useState } from 'react';
import { Box, styled } from '@mui/material';
import MyPageProfile from './components/MyPageProfile';
import HealthCheckUp from './components/HealthCheckUp';
import Preview from './components/Preview';

const HealthCheckupHistory = () => {
  const [selectedRow, setSelectedRow] = useState('');
  const [rows, setRows] = useState([]);

  const handleDeleteRow = (rowNo) => {
    setRows(prevRows => prevRows.filter(r => r.no !== rowNo));
    setSelectedRow('');
  }

  return (
    <Box sx={{display: 'flex', width: '100%', height: '89vh', boxSizing: 'border-box', gap: 2, padding: 2}}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', boxSizing: 'border-box', gap: 4 }}>
        <MyPageProfile />
        <HealthCheckUp onRowSelect={setSelectedRow} rows={rows} setRows={setRows} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%', boxSizing: 'border-box', gap: 4 }}>
        <Preview row={selectedRow} setRows={setRows} onDelete={handleDeleteRow} />
      </Box>
    </Box>
  );
};

export default HealthCheckupHistory;
