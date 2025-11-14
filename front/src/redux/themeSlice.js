import { createSlice } from '@reduxjs/toolkit';

const initialState = {
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
