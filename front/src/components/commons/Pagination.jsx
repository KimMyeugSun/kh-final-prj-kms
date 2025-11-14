import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

/**
 * Mui 공용 페이지네이션 컴포넌트
 * @param {number} page 현재 페이지 (1부터 시작)
 * @param {number} count 총 페이지 수
 * @param {function} onChange 페이지 변경 시 호출되는 함수 (event, page) => {}
 * @param {string} size 'small' | 'medium' (기본값: 'medium')
 * @param {string} color 'primary' | 'secondary' | 'standard' (기본값: 'primary')
 * @returns 
 * 
 * 사용예시:
 * const [page, setPage] = useState(1);
 * const handlePageChange = (event, newPage) => {
 *   setPage(newPage);
 * };
 *
 * <CommonPagination page={page} count={10} onChange={handlePageChange} />
 */
const CommonPagination = ({
  page,
  count,
  onChange,
  size = 'medium',
  color = 'primary',
}) => {
  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
      <Pagination
        page={page}
        count={count}
        onChange={onChange}
        size={size}
        color={color}
      />
    </Stack>
  );
};

export default CommonPagination;
