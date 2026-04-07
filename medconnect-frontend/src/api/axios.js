import axios from 'axios'

const API = axios.create({
  // This looks for the variable in your .env file. 
  // If it's not found, it falls back to localhost.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    // This attaches your JWT token to every request automatically
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API