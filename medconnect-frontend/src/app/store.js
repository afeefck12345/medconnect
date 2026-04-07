import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import doctorReducer from '../features/doctor/doctorSlice'
import appointmentReducer from '../features/appointment/appointmentSlice'
import adminReducer from '../features/admin/adminSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    appointment: appointmentReducer,
    admin: adminReducer,
  },
})

export default store
