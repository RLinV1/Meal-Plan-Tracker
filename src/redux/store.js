// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import refreshReducer from './refreshSlice';
import addItemModalSlice from './addItemModalSlice';
import deleteItemModalSlice from './deleteItemModalSlice';
import editItemModalSlice from './editItemModalSlice';
import calculateCostsModalSlice from './calculateMealsModalSlice';

const store = configureStore({
  reducer: {
    refresh: refreshReducer,
    addModal: addItemModalSlice, // Add the addItemModal slice here
    editModal: editItemModalSlice, // Edit the addItemModal slice here
    deleteModal: deleteItemModalSlice,
    costsModal: calculateCostsModalSlice,
  },
});

export default store;
