import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import notificationReducer from './notificationSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    notification: notificationReducer,
  },
});

export default store;
