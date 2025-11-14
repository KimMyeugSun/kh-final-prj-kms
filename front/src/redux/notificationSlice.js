import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    packet: [],
  },
  reducers: {
    addNotification: (state, action) => {
      // 디버그: 누가 호출했는지 스택 확인
      const items = Array.isArray(action.payload) ? action.payload : [action.payload];
      // 중복(nno 기준) 방지하여 동일 알림이 두 번 추가되는 것을 막음
      for (const it of items) {
        if (!state.packet.some((p) => p.nno === it.nno)) {
          state.packet.push(it);
        }
      }
    },

    removeNotification: (state, action) => {
      state.packet = state.packet.filter((p) => {
        return p.nno !== action.payload.nno;
      });
    },

    clearNotifications: (state) => {
      state.packet = [];
    },
  },  
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
