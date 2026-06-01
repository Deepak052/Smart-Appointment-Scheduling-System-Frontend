import axios from 'axios';
import { API_URL } from '../../utils/constants';



const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authAPI = {
    login: (data) => api.post('/auth/login', data).then(res => res.data),
    register: (data) => api.post('/auth/register', data).then(res => res.data),
};

export const appointmentAPI = {
    getAvailable: (date) => api.get('/appointments/available', { params: { date } }).then(res => res.data),
    getMyBookings: () => api.get('/appointments/my-appointments').then(res => res.data),
    book: (id) => api.post(`/appointments/book/${id}`).then(res => res.data),
    cancel: (id) => api.put(`/appointments/cancel/${id}`).then(res => res.data),
    generate: () => api.post('/appointments/generate').then(res => res.data),
};

export default api;
