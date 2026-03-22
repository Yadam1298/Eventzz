import axios from 'axios';

// Base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach Token Automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* ===============================
   AUTH APIs
================================ */

export const registerUser = (data) => API.post('/auth/register', data);

export const loginUser = (data) => API.post('/auth/login', data);

/* ===============================
   EVENT APIs (User)
================================ */

export const createEvent = (data) => API.post('/events', data);

export const getMyEvents = () => API.get('/events/my-events');

export const getSingleEvent = (id) => API.get(`/events/${id}`);

/* ===============================
   EVENT APIs (Admin)
================================ */

export const getAllEvents = () => API.get('/events');

export const updateEvent = (id, data) => API.put(`/events/${id}`, data);

export const updateEventStatus = (id, data) =>
  API.patch(`/events/${id}/status`, data);

/* ===============================
   PORTFOLIO APIs
================================ */

export const createPortfolio = (data) => API.post('/portfolio', data);

/* ===============================
   FEEDBACK APIs
================================ */

export const submitFeedback = (data) => API.post('/feedback', data);
