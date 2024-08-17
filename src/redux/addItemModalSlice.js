import { createSlice } from '@reduxjs/toolkit';

const addItemModalSlice = createSlice({
  name: 'modal',
  initialState: {
    isModalOpen: false,
  },
  reducers: {
    closeAddModal: (state) => {
      state.isModalOpen = false;
    },
    openAddModal: (state) => {
      state.isModalOpen = true;
    },
  },
});

export const { closeAddModal, openAddModal } = addItemModalSlice.actions;
export default addItemModalSlice.reducer;
