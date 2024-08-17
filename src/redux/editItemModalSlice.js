import { createSlice } from '@reduxjs/toolkit';

const editItemModalSlice = createSlice({
  name: 'modal',
  initialState: {
    isModalOpen: false,
  },
  reducers: {
    closeEditModal: (state) => {
      state.isModalOpen = false;
    },
    openEditModal: (state) => {
      state.isModalOpen = true;
    },
  },
});

export const { closeEditModal, openEditModal } = editItemModalSlice.actions;
export default editItemModalSlice.reducer;
