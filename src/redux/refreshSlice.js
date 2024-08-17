import { createSlice } from '@reduxjs/toolkit';

const refreshSlice = createSlice({
  name: 'refresh',
  initialState: {
    shouldRefresh: false,
  },
  reducers: {
    triggerRefresh: (state) => {
      state.shouldRefresh = true;
    },
    resetRefresh: (state) => {
      state.shouldRefresh = false;
    },
  },
});

export const { triggerRefresh, resetRefresh } = refreshSlice.actions;
export default refreshSlice.reducer;
