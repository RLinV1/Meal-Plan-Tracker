import { createSlice } from '@reduxjs/toolkit';

const deleteItemModalSlice = createSlice({
  name: 'modal',
  initialState: {
    isModalOpen: false,
  },
  reducers: {
    closeDeleteModal: (state) => {
      state.isModalOpen = false;
    },
    openDeleteModal: (state) => {
      state.isModalOpen = true;
    },
  },
});

export const { closeDeleteModal, openDeleteModal } = deleteItemModalSlice.actions;
export default deleteItemModalSlice.reducer;
