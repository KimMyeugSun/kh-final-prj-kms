import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CardShell from './CardShell';
import CalendarWidget from '../widgets/calendar/CalendarWidget';
import CircleIcon from '@mui/icons-material/Circle';

export default function CalendarCard({
  events,
  onCreate,
  onEdit,
  grow = false,
  onRange,

  foodPath = '/lifestyle/food',
  workoutPath = '/lifestyle/workout',
}) {
  const navigate = useNavigate();

  return (
    <CardShell
      title="내 캘린더"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        ...(grow ? { flex: 1, minHeight: 0 } : {}),
      }}
    >
      {/* 상단 우측 컨트롤: 식사 추가 / 운동 추가 */}
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Chip
          size="small"
          clickable
          onClick={() => navigate(foodPath)}
          label="식사 추가"
          icon={<CircleIcon fontSize="small" />}
          sx={{
            bgcolor: 'transparent',
            border: 'none',
            fontWeight: 600,
            '& .MuiChip-icon': { color: '#f59e0b', mr: 0.5 },
          }}
        />

        <Chip
          size="small"
          clickable
          onClick={() => navigate(workoutPath)}
          label="운동 추가"
          icon={<CircleIcon fontSize="small" />}
          sx={{
            bgcolor: 'transparent',
            border: 'none',
            fontWeight: 600,
            '& .MuiChip-icon': { color: '#3b82f6', mr: 0.5 },
          }}
        />
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, px: 2, pb: 2 }}>
        <CalendarWidget
          style={{ width: '100%', height: '100%' }}
          events={events}
          onCreate={onCreate}
          onEdit={onEdit}
          onRange={onRange}
        />
      </Box>
    </CardShell>
  );
}
