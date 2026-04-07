import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

// Get All Users
export const getAllUsers = createAsyncThunk('admin/getAllUsers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/admin/users')
    return data
  } catch (err) {
    return rejectWithValue(err.response.data.message)
  }
})

// Delete User
export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/admin/users/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response.data.message)
  }
})

// Get All Doctors
export const getAllDoctors = createAsyncThunk('admin/getAllDoctors', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/admin/doctors')
    return data
  } catch (err) {
    return rejectWithValue(err.response.data.message)
  }
})

// Approve Doctor
export const approveDoctor = createAsyncThunk('admin/approveDoctor', async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/admin/doctors/${id}/approve`)
    return data
  } catch (err) {
    return rejectWithValue(err.response.data.message)
  }
})

// Reject Doctor
export const rejectDoctor = createAsyncThunk('admin/rejectDoctor', async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/admin/doctors/${id}/reject`)
    return data
  } catch (err) {
    return rejectWithValue(err.response.data.message)
  }
})

// Get Analytics
export const getAnalytics = createAsyncThunk('admin/getAnalytics', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/admin/analytics')
    return data
  } catch (err) {
    return rejectWithValue(err.response.data.message)
  }
})

// Get All Appointments
export const getAllAppointments = createAsyncThunk('admin/getAllAppointments', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/admin/appointments')
    return data
  } catch (err) {
    return rejectWithValue(err.response.data.message)
  }
})

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    doctors: [],
    appointments: [],
    analytics: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Users
      .addCase(getAllUsers.pending, (state) => { state.loading = true; state.error = null })
      .addCase(getAllUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload })
      .addCase(getAllUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload)
      })

      // Get All Doctors
      .addCase(getAllDoctors.pending, (state) => { state.loading = true })
      .addCase(getAllDoctors.fulfilled, (state, action) => { state.loading = false; state.doctors = action.payload })
      .addCase(getAllDoctors.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // Approve Doctor
      .addCase(approveDoctor.fulfilled, (state, action) => {
        const index = state.doctors.findIndex((d) => d._id === action.payload._id)
        if (index !== -1) state.doctors[index] = action.payload
      })

      // Reject Doctor
      .addCase(rejectDoctor.fulfilled, (state, action) => {
        const index = state.doctors.findIndex((d) => d._id === action.payload._id)
        if (index !== -1) state.doctors[index] = action.payload
      })

      // Get Analytics
      .addCase(getAnalytics.pending, (state) => { state.loading = true })
      .addCase(getAnalytics.fulfilled, (state, action) => { state.loading = false; state.analytics = action.payload })
      .addCase(getAnalytics.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // Get All Appointments
      .addCase(getAllAppointments.pending, (state) => { state.loading = true })
      .addCase(getAllAppointments.fulfilled, (state, action) => { state.loading = false; state.appointments = action.payload })
      .addCase(getAllAppointments.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { clearAdminError } = adminSlice.actions
export default adminSlice.reducer