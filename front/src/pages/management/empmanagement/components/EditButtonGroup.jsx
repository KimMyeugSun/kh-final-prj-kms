import { Box, Button } from '@mui/material';
/**
 * 권한 수정 버튼 그룹 컴포넌트
 * @param {function} handleGrant 권한 부여 함수
 * @param {function} handleRevoke 권한 회수 함수
 * @param {boolean} isSelectedAvailable 부여할 권한이 선택되었는지 여부
 * @param {boolean} isSelectedGranted 회수할 권한이 선택되었는지 여부
 * @returns 
 */
const MoveButtonGroup = ({ handleGrant, handleRevoke, isSelectedAvailable, isSelectedGranted }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2}} >
      <Button variant="contained" onClick={handleGrant} disabled={isSelectedAvailable} >
        {'>'}
      </Button>
      <Button variant="contained" onClick={handleRevoke} disabled={isSelectedGranted} >
        {'<'}
      </Button>
    </Box>
  );
};

export default MoveButtonGroup;
