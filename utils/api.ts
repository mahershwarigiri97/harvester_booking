import axios from 'axios';
import storage from './storage';

// Replace with your machine's IP address for physical device testing
// Example: http://192.168.1.5:3000/api
const BASE_URL = 'http://192.168.1.5:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('userToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  sendOtp: (phone: string) => api.post('/auth/send-otp', { phone }),
  verifyOtp: (phone: string, otp: string) => api.post('/auth/verify-otp', { phone, otp }),
  register: (data: { phone: string; role: string; name?: string; address?: any }) => api.post('/auth/register', data),
  completeOwnerProfile: (data: any) => api.post('/auth/owner/complete-profile', data),
  uploadImages: async (formData: FormData, folder: string) => {
    // We use native fetch for uploads in React Native as it handles multipart boundaries 
    // more reliably than Axios on some devices.
    const response = await fetch(`${BASE_URL}/upload/${folder}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw { response: { data } };
    return { data };
  },
  getProfile: (userId: string) => api.get(`/auth/profile/${userId}`),
  getHarvesters: () => api.get('/harvesters'),
  getHarvesterById: (id: string) => api.get(`/harvesters/${id}`),
  createBooking: (data: {
    farmer_id: number;
    harvester_id: number;
    owner_id: number;
    customer_name: string;
    customer_phone: string;
    farm_latitude: number;
    farm_longitude: number;
    crop_type?: string;
    land_area: number;
    price: number;
    start_time?: string;
  }) => api.post('/bookings', data),
  getBookingById: (id: string) => api.get(`/bookings/${id}`),
  getMyBookings: (userId: number, role: 'farmer' | 'owner') =>
    api.get(`/bookings?userId=${userId}&role=${role}`),
  updateBookingStatus: (id: string, status: string, note?: string, cancelReason?: string, updatedByUser?: string, duration?: string) =>
    api.patch(`/bookings/${id}/status`, { status, note, cancelReason, updatedByUser, duration }),
  getBookingTracking: (id: string) => api.get(`/bookings/${id}/tracking`),
};

export default api;
