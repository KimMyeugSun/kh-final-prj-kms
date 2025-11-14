import './App.css';

//!< 라이브러리 import
import { ThemeProvider } from '@mui/material/styles';
import { team119Theme } from './theme/themes';
import { _VERSION_ } from './define/Version';
import { Routes } from 'react-router-dom';

import generalRoutes from './Routes/GeneralRoutes';
import managementRoutes from './Routes/ManagementRoutes';
import commonRoutes from './Routes/CommonRoutes';
import NotificationManager from './notificationManager/NotificationManager';

function App() {
  return (
    <ThemeProvider theme={team119Theme}>
      <NotificationManager>
        <Routes>
          {managementRoutes}
          {generalRoutes}
          {commonRoutes}
        </Routes>
      </NotificationManager>
    </ThemeProvider>
  );
}

export default App;
