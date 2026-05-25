import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

export const bookAppointment = createAsyncThunk('appointment/book', async (appointmentData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/appointments', appointmentData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to book appointment')
  }
})

// Used by PATIENT pages — hits GET /appointments/my (patient-only route)
export const cancelAppointment = createAsyncThunk('appointment/cancel', async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/appointments/${id}/cancel`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to cancel appointment')
  }
})

export const rescheduleAppointment = createAsyncThunk('appointment/reschedule', async ({ id, appointmentData }, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/appointments/${id}/reschedule`, appointmentData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to reschedule appointment')
  }
})

export const getMyAppointments = createAsyncThunk('appointment/getMy', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/appointments/my')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch appointments')
  }
})

// Used by DOCTOR pages — hits GET /appointments/doctor (doctor-only route)
export const getDoctorAppointments = createAsyncThunk('appointment/getDoctor', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/appointments/doctor')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch appointments')
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
    const updateAppointmentInState = (state, updatedAppointment) => {
      state.appointments = state.appointments.map((appointment) => (
        appointment._id === updatedAppointment._id
          ? {
              ...appointment,
              ...updatedAppointment,
              doctor: !updatedAppointment.doctor || typeof updatedAppointment.doctor === 'string' ? appointment.doctor : updatedAppointment.doctor,
              patient: !updatedAppointment.patient || typeof updatedAppointment.patient === 'string' ? appointment.patient : updatedAppointment.patient,
            }
          : appointment
      ))
    }

    builder
      // bookAppointment
      .addCase(bookAppointment.pending,   (state)         => { state.loading = true; state.error = null })
      .addCase(bookAppointment.fulfilled, (state, action) => { state.loading = false; state.appointments.push(action.payload.appointment) })
      .addCase(bookAppointment.rejected,  (state, action) => { state.loading = false; state.error = action.payload })

      // cancelAppointment
      .addCase(cancelAppointment.pending,   (state)         => { state.loading = true; state.error = null })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false
        updateAppointmentInState(state, action.payload.appointment)
      })
      .addCase(cancelAppointment.rejected,  (state, action) => { state.loading = false; state.error = action.payload })

      // rescheduleAppointment
      .addCase(rescheduleAppointment.pending,   (state)         => { state.loading = true; state.error = null })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.loading = false
        updateAppointmentInState(state, action.payload.appointment)
      })
      .addCase(rescheduleAppointment.rejected,  (state, action) => { state.loading = false; state.error = action.payload })

      // getMyAppointments (patient)
      .addCase(getMyAppointments.pending,   (state)         => { state.loading = true; state.error = null })
      .addCase(getMyAppointments.fulfilled, (state, action) => { state.loading = false; state.appointments = action.payload })
      .addCase(getMyAppointments.rejected,  (state, action) => { state.loading = false; state.error = action.payload })

      // getDoctorAppointments (doctor)
      .addCase(getDoctorAppointments.pending,   (state)         => { state.loading = true; state.error = null })
      .addCase(getDoctorAppointments.fulfilled, (state, action) => { state.loading = false; state.appointments = action.payload })
      .addCase(getDoctorAppointments.rejected,  (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export default appointmentSlice.reducer
