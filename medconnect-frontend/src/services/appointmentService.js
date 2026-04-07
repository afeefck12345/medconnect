import API from '../api/axios';
export const bookAppointment = (data) => API.post('/appointments', data);
export const getMyAppointments = () => API.get('/appointments/my-appointments');