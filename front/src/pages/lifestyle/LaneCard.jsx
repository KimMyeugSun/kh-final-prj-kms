import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const BLUE = '#2D7DF6';

const ColumnHeader = ({ title, done, total }) => (
  <Box
    sx={{
      background: BLUE,
      color: '#fff',
      borderRadius: '10px 10px 0 0',
      px: 2,
      py: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1,
    }}
  >
    <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
    <Chip
      size="small"
      label={`${done}/${total}`}
      sx={{
        background: 'rgba(255,255,255,.2)',
        color: '#fff',
        fontWeight: 700,
      }}
    />
  </Box>
);

function ItemCard({
  item,
  laneId,
  draggingId,
  onDragStart,
  onDragEnd,
  onToggle,
}) {
  return (
    <Paper
      elevation={1}
      draggable
      onDragStart={(e) => onDragStart(e, laneId, item.id)}
      onDragEnd={onDragEnd}
      sx={{
        p: 1.1,
        borderRadius: 1.5,
        opacity: draggingId === item.id ? 0.55 : 1,
        cursor: 'grab',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(laneId, item.id);
        }}
      >
        {item.done ? (
          <CheckCircleIcon sx={{ color: '#22c55e' }} />
        ) : (
          <RadioButtonUncheckedIcon sx={{ color: '#9ca3af' }} />
        )}
      </IconButton>
      <Typography
        sx={{
          fontWeight: 600,
          color: item.done ? 'text.disabled' : 'text.primary',
          textDecoration: item.done ? 'line-through' : 'none',
        }}
      >
        {item.text}
      </Typography>
    </Paper>
  );
}

export default function LaneCard({
  laneId,
  lane,
  canDrop,
  overLaneId,
  setOverLaneId,
  onDropToLane,
  draggingId,
  onDragStart,
  onDragEnd,
  onToggle,
}) {
  const total = lane.items.length;
  const done = lane.items.filter((i) => i.done).length;

  return (
    <Paper
      elevation={1}
      sx={{
        width: 300,
        borderRadius: 2,
        overflow: 'hidden',
        border: (t) => `1px solid ${t.palette.divider}`,
        background: (t) => t.palette.background.paper,
      }}
    >
      <ColumnHeader title={lane.title} done={done} total={total} />

      <Box
        onDragOver={(e) => {
          if (!canDrop) return;
          e.preventDefault();
          if (overLaneId !== laneId) setOverLaneId(laneId);
        }}
        onDragLeave={() => setOverLaneId(null)}
        onDrop={(e) => {
          if (!canDrop) return;
          e.preventDefault();
          setOverLaneId(null);
          const txt = e.dataTransfer.getData('text/plain');
          if (!txt) return;
          try {
            const { from, itemId } = JSON.parse(txt);
            onDropToLane(from, itemId, laneId);
          } catch {}
        }}
        sx={{
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minHeight: 80,
          border:
            canDrop && overLaneId === laneId
              ? '2px dashed #8fb7ff'
              : '2px dashed transparent',
          backgroundColor:
            canDrop && overLaneId === laneId
              ? 'rgba(45,125,246,.06)'
              : 'transparent',
          transition: 'border-color .12s ease, background-color .12s ease',
        }}
      >
        {lane.items.map((it) => (
          <ItemCard
            key={it.id}
            item={it}
            laneId={laneId}
            draggingId={draggingId}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onToggle={onToggle}
          />
        ))}
      </Box>
    </Paper>
  );
}
