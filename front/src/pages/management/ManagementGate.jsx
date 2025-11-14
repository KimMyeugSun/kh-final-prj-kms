import { Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/useAuth';
import ManagementSignIn from '../../pages/management/signIn/ManagementSignIn';
import ManagementLayout from '../../layout/ManagementLayout';
import { useLocation } from 'react-router-dom';

const ManagementGate = () => {
  const location = useLocation();
  const { getUser, getRoles, signOut } = useAuth();
  const hasAccess =
    !!getUser() && getRoles().some((r) => ['ADMIN', 'MANAGER'].includes(r));
  const [showAlert, setShowAlert] = useState(false);

  // 권한 없음 Alert 후 1초 뒤 signOut
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        signOut(location);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showAlert, signOut]);

  if (!getUser()) {
    return <ManagementSignIn />;
  }
  if (!hasAccess) {
    if (!showAlert) setShowAlert(true);
    return (
      <>
        {showAlert && (
          <Alert severity="error" sx={{ mb: 2 }}>
            관리자 페이지 접근 권한이 없습니다.
          </Alert>
        )}
        <ManagementSignIn />
      </>
    );
  }
  return <ManagementLayout />;
};

export default ManagementGate;
