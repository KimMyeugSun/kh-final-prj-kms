import React from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const INPUT_H = 64;
const ICON_INSET = 8;
const ICON_SIZE = INPUT_H - ICON_INSET * 2;

export default function SearchBar({
  value,
  onChange,
  onSearch,
  canSearch,
  placeholder = '검색어를 입력해주세요',
  fullWidth = true,
  sx,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <TextField
      fullWidth={fullWidth}
      size="medium"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      InputProps={{
        sx: {
          height: INPUT_H,
          borderRadius: 5,
          pr: 0,
          // 좌우 패딩 균일화 — placeholder 시작선 통일
          '& .MuiInputBase-input': {
            textAlign: 'center',
            paddingLeft: '14px', // ← 이 값으로 시작선 보정 (양쪽 동일)
            paddingRight: '14px',
          },
          '& input::placeholder': { textAlign: 'center', opacity: 0.9 },
          '& .MuiInputAdornment-root': { height: '100%' },
        },
        endAdornment: (
          <InputAdornment position="end" sx={{ mr: 0, height: '100%' }}>
            <IconButton
              aria-label="search"
              onClick={onSearch}
              disabled={!canSearch}
              sx={{
                m: `${ICON_INSET}px`,
                width: ICON_SIZE,
                height: ICON_SIZE,
                borderRadius: 3,
                background: '#E6F0FF',
                '&:hover': { background: '#d9e9ff' },
              }}
            >
              <SearchIcon sx={{ color: '#2D7DF6' }} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={sx}
    />
  );
}
