import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

// Register
export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/register', userData)
    localStorage.setItem('token', data.token)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

// Login
export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/login', userData)
    localStorage.setItem('token', data.token)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

// Get Profile (For Persistence on Refresh)
export const getUserProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/auth/profile')
    return data
  } catch (err) {
    // If profile fetch fails (e.g. expired token), we should clear the local token
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
    }
    return rejectWithValue(err.response?.data?.message || 'Session expired')
  }
})

// NEW: Update User Profile (Fixes "No Save API Call" Critical Issue)
export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.put('/users/profile', userData) // Ensure backend route matches
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Register/Login Loading States
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(registerUser.fulfilled, (state, action) => { 
        state.loading = false; 
        state.user = action.payload; 
        state.token = action.payload.token 
      })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => { 
        state.loading = false; 
        state.user = action.payload; 
        state.token = action.payload.token 
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      
      // Profile Persistence
      .addCase(getUserProfile.pending, (state) => { state.loading = true })
      .addCase(getUserProfile.fulfilled, (state, action) => { 
        state.loading = false; 
        state.user = action.payload 
      })
      .addCase(getUserProfile.rejected, (state) => { 
        state.loading = false; 
        state.user = null; 
        state.token = null 
      })

      // Update Profile Success
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer