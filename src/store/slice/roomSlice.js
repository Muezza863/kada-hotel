import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async () => {
  console.log('Fetching rooms from API...');
  const response = await fetch('https://69953a6ab081bc23e9c25d37.mockapi.io/api/rooms');
  return response.json();
});

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    list: [],
    loading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {
    updateRoomStatusLocal: (state, action) => {
      const { roomId, status } = action.payload;
      console.log('updateRoomStatusLocal', roomId, status);
      const room = state.list.find(r => r.id === roomId);
      if (room) {
        room.status = status;
      } else {
        console.warn('Room not found!', roomId);
      }
    },
    updateBookingId: (state, action) => {
      const { roomId, bookingId } = action.payload;
      console.log('updateBookingId', roomId, bookingId);
      const room = state.list.find(r => r.id === roomId);
      if (room) {
        room.currentBookingId = bookingId;
      } else {
        console.warn('Room not found!', roomId);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.hasFetched = false;
      });
  },
});

export const { updateRoomStatusLocal, updateBookingId } = roomsSlice.actions;
export default roomsSlice.reducer;