import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './redux/store';
import { StyledEngineProvider } from '@mui/material';

// calendar
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import {AuthProvider} from './auth/AuthContext';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthProvider>
        <StyledEngineProvider injectFirst>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />
          </LocalizationProvider>
        </StyledEngineProvider>
      </AuthProvider>
    </BrowserRouter>
  </Provider>
);
