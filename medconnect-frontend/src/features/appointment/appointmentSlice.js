import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

export const bookAppointment = createAsyncThunk('appointment/book', async (appointmentData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/appointments', appointmentData)
    return data
  } catch (err) {
    return rejectWithValue(err.response.data.message)
  }
})

export const getMyAppointments = createAsyncThunk('appointment/getMy', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/appointments/my')
    return data
  } catch (err) {
    return rejectWithValue(err.response.data.message)
  }
})

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: {
    appointments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bookAppointment.pending, (state) => { state.loading = true })
      .addCase(bookAppointment.fulfilled, (state, action) => { state.loading = false; state.appointments.push(action.payload.appointment) })
      .addCase(bookAppointment.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(getMyAppointments.fulfilled, (state, action) => { state.appointments = action.payload })
  },
})

export default appointmentSlice.reducer