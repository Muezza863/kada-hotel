import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCheckOutData = createAsyncThunk("checkOut/fetchCheckOutData", async (bookingId, { rejectWithValue }) => {
    try {
            const bookigResponse = await fetch(`https://69953a6ab081bc23e9c25d37.mockapi.io/api/activeBookings/${bookingId}`)
            const bookingData = await bookigResponse.json();

            if(!bookigResponse.ok) throw new Error("Booking not found");

            const [roomResponse, equipmentResponse] = await Promise.all([
                fetch(`https://69953a6ab081bc23e9c25d37.mockapi.io/api/rooms/${bookingData.roomId}`),
                fetch(`https://my-json-server.typicode.com/Muezza863/Kada-Hotel-Json/equipmentList`)
            ])

            const [roomData, equipmentData] = await Promise.all([
                roomResponse.json(),
                equipmentResponse.json()
            ])

            return { bookingData, roomData, equipmentData }
        } catch (error) {
            return rejectWithValue(error.message)
        }
});

export const processCheckOut = createAsyncThunk("checkOut/processCheckOut", async ({ bookingId, roomId }, {rejectWithValue}) => {
    try {
        await fetch(`https://69953a6ab081bc23e9c25d37.mockapi.io/api/activeBookings/${bookingId}`, {
            method: 'DELETE',
        })

        await fetch(`https://69953a6ab081bc23e9c25d37.mockapi.io/api/rooms/${roomId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'available',
                currentBookingId: null
            })
        })

        return { bookingId, roomId }
        
    } catch (error) {
        return rejectWithValue(error.message)
    }
});

const checkOutSlice = createSlice({
    name: 'checkOut',
    initialState: {
        bookingData: null,
        roomData: null,
        equipmentData: null,
        isLoading: false,
        error: null,
        success: false
    },
    reducers: {
        resetCheckOutState: (state) => {
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCheckOutData.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(fetchCheckOutData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.bookingData = action.payload.bookingData;
            state.roomData = action.payload.roomData;
            state.equipmentData = action.payload.equipmentData;
        })
        builder.addCase(fetchCheckOutData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        builder.addCase(processCheckOut.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(processCheckOut.fulfilled, (state, action) => {
            state.isLoading = false;
            state.success = true;
        })
        builder.addCase(processCheckOut.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

export const { resetCheckOutState } = checkOutSlice.actions
export default checkOutSlice.reducer