import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from './slice/roomSlice';
import checkOutReducer from './slice/checkOutSlice';

export const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    checkOut: checkOutReducer,
  },
});