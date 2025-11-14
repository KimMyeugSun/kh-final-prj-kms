import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

/*
    1. 상태 추가하기
          const [snackbar, setSnackbar] = useState({
              open: false,
              message: '',
              severity: 'info',
            });

    2. CommonSanckbar 추가
          <CommonSnackbar
            open={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          />

    3. 스낵바 필요한 곳에 추가
          setSnackbar({
            open: true,
            message: '찜 목록에 추가되었습니다.',
            severity: 'success',
          });
*/

// MUI Alert 쓸 때 Snackbar 에서 ref 를 잘 전달받을 수 있게 포장해 둔 래퍼 컴포넌트
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CommonSnackbar({
  open,
  message,
  severity = 'info', // 알림 타입 : error(빨강), warning(주황), info(파랑), success (초록)
  onClose,
  autoHideDuration = 3000, // 스낵바 자동으로 닫히는 시간 : 3초
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // 스낵바 위치 : 화면 상단 중앙
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
