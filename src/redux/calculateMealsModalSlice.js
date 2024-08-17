import { createSlice } from '@reduxjs/toolkit';

const calculateMealsModalSlice = createSlice({
  name: 'modal',
  initialState: {
    isModalOpen: false,
  },
  reducers: {
    closeMealsModal: (state) => {
      state.isModalOpen = false;
    },
    openMealsModal: (state) => {
      state.isModalOpen = true;
    },
  },
});

export const { closeMealsModal, openMealsModal } = calculateMealsModalSlice.actions;
export default calculateMealsModalSlice.reducer;
