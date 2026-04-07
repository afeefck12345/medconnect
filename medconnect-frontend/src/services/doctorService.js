import API from '../api/axios';
export const getDoctors = () => API.get('/doctors');
export const getDoctorById = (id) => API.get(`/doctors/${id}`);