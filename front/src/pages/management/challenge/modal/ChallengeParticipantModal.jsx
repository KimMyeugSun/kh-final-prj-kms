import { useMemo } from 'react';
import Modal from '../../../../components/commons/Modal';
import SearchBar from '../../../../components/commons/SearchBar';
import CommonTable from '../../../../components/commons/CommonTable';
import CommonPagination from '../../../../components/commons/Pagination';
import { Box, Typography } from '@mui/material';

const ChallengeParticipantModal = ({
  open,
  onClose,
  participants = [],
  page,
  totalPages,
  totalElements,
  onPageChange,
  onSearch,
  cno,
}) => {
  const tableHeader = useMemo(
    () => [
      { header: '사번', field: 'eno' },
      { header: '참가자 ID', field: 'empId' },
      { header: '참가자명', field: 'empName' },
    ],
    []
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      sx={{ p: 3, width: 480, maxWidth: '96vw' }}
    >
      <Box component="header" sx={{ mb: 2, fontSize: 18, fontWeight: 800 }}>
        챌린지 참가자 목록
      </Box>

      {/* 검색 */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
        <SearchBar
          placeholder="사번/참가자ID/참가자명 검색"
          onSearch={onSearch}
          width={300}
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          총 {totalElements}명
        </Typography>
      </Box>

      {/* 테이블 */}
      <CommonTable
        tableHeader={tableHeader}
        rows={participants}
        getRowLink={(row) => `/management/challenge/${cno}/certify/${row.eno}`}
      />

      {/* 페이지네이션 */}
      {totalElements > 0 ? (
        <CommonPagination
          page={page + 1}
          count={totalPages}
          onChange={(_, val) => onPageChange(val - 1)}
          size="small"
        />
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, textAlign: 'center' }}
        >
          검색 결과가 없습니다.
        </Typography>
      )}
    </Modal>
  );
};

export default ChallengeParticipantModal;
