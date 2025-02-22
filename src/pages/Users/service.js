import { api } from 'common/utils/api.util';
import { ROOT_ROUTE } from './const';

const createUser = (data = {}) => api.post(`${ROOT_ROUTE}`, data);
const updateUser = (data = {}) => api.put(`${ROOT_ROUTE}`, data);
const getUserList = (params = {}) => api.get(`${ROOT_ROUTE}`, { params });
const getUserDetail = (id) => api.get(`${ROOT_ROUTE}/${id}`);
const deleteUsers = (params) => api.delete(`${ROOT_ROUTE}`, { params });
const getUserOptions = (params = {}) => api.get(`${ROOT_ROUTE}/options`, { params });
const getUserInfo = () => api.get(`${ROOT_ROUTE}/info`);

export { createUser, updateUser, getUserList, getUserDetail, deleteUsers, getUserOptions, getUserInfo };
