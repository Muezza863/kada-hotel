import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from './slice/roomSlice';

export const store = configureStore({
  reducer: {
    rooms: roomsReducer,
  },
});