import axios from 'axios';
import { ElMessage } from 'element-plus';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

request.interceptors.response.use(
  (res) => res.data,
  (err) => {
    ElMessage.error(err.response?.data?.message || '请求失败');
    return Promise.reject(err);
  }
);

export const surfSpotApi = {
  list: () => request.get('/surf-spots'),
  detail: (id) => request.get(`/surf-spots/${id}`),
  stats: (id) => request.get(`/surf-spots/${id}/stats`),
  create: (data) => request.post('/surf-spots', data),
  update: (id, data) => request.put(`/surf-spots/${id}`, data),
  remove: (id) => request.delete(`/surf-spots/${id}`),
};

export const forecastApi = {
  getBySpot: (spotId, startDate, endDate) =>
    request.get(`/forecasts/spot/${spotId}`, { params: { startDate, endDate } }),
  fetch: () => request.post('/forecasts/fetch'),
};

export const checkinApi = {
  list: (limit = 100) => request.get('/checkins', { params: { limit } }),
  getBySpot: (spotId, limit = 50) => request.get(`/checkins/spot/${spotId}`, { params: { limit } }),
  create: (data) => request.post('/checkins', data),
  remove: (id) => request.delete(`/checkins/${id}`),
};

export const surfLogApi = {
  list: (params) => request.get('/surf-logs', { params }),
  detail: (id) => request.get(`/surf-logs/${id}`),
  create: (data) => request.post('/surf-logs', data),
  update: (id, data) => request.put(`/surf-logs/${id}`, data),
  remove: (id) => request.delete(`/surf-logs/${id}`),
};
