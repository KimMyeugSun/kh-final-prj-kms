import { Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import MainLayout from '../layout/MainLayout';
import SignIn from './account/SignIn';
import { useLocation } from 'react-router-dom';

const UserGate = () => {
  const location = useLocation();
  const { getUser, getRoles, signOut } = useAuth();
  const hasAccess =
    !!getUser() && getRoles()?.some((r) => ['ADMIN', 'MANAGER', 'USER'].includes(r));
  const [showAlert, setShowAlert] = useState(false);


  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        signOut(location);
        navigate('/account/sign-in', { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showAlert, signOut]);

  if (!getUser()) {
    return <SignIn />;
  }
  if (!hasAccess) {
    if (!showAlert) setShowAlert(true);
    return (
      <>
        {showAlert && (
          <Alert severity="error" sx={{ mb: 2 }}>
            권한이 없습니다.
          </Alert>
        )}
        <SignIn />
      </>
    );
  }
  return <MainLayout />;
};

export default UserGate;