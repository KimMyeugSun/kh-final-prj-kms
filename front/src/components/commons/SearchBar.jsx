import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { useState } from 'react';

/**
 * Mui 공용 검색바 컴포넌트
 * @param {string} placeholder 입력창에 표시할 안내 문구
 * @param {function} onSearch 검색 버튼 클릭 또는 엔터 시 호출되는 함수, (검색어) => {}
 * @param {number} width 컴포넌트 너비 (기본값: 400)
 * @returns 
 * 
 * @example:
 * const [query, setQuery] = useState('');
 *    const handleSearch = (q) => {
 *     setQuery(q?.trim());
 *     setOpen(true);
 *   };
 *
 * <SearchBar placeholder={'검색할 단어를 입력해주세요'} onSearch={handleSearch} />
 */
const SearchBar = ({ placeholder, onSearch, width = 400 }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width }}
      onSubmit={handleSubmit}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        onChange={(evt) => setValue(evt.target.value)}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
