import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

export const getAllDoctors = createAsyncThunk('doctor/getAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/doctors')
    return data
  } catch (err) {
    return rejectWithValue(err.response.data.message)
  }
})

export const getDoctorById = createAsyncThunk('doctor/getById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/doctors/${id}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response.data.message)
  }
})

const doctorSlice = createSlice({
  name: 'doctor',
  initialState: {
    doctors: [],
    selectedDoctor: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllDoctors.pending, (state) => { state.loading = true })
      .addCase(getAllDoctors.fulfilled, (state, action) => { state.loading = false; state.doctors = action.payload })
      .addCase(getAllDoctors.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(getDoctorById.fulfilled, (state, action) => { state.selectedDoctor = action.payload })
  },
})

export default doctorSlice.reducer