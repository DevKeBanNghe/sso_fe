import { api } from 'common/utils/api.util';
import { ROOT_ROUTE } from './const';
import { exportExcel } from 'common/utils/excel.util';

const createUser = (data = {}) => api.post(`${ROOT_ROUTE}`, data);
const updateUser = (data = {}) => api.put(`${ROOT_ROUTE}`, data);
const getUserList = (params = {}) => api.get(`${ROOT_ROUTE}`, { params });
const getUserDetail = (id) => api.get(`${ROOT_ROUTE}/${id}`);
const deleteUsers = (params) => api.delete(`${ROOT_ROUTE}`, { params });
const getUserOptions = (params = {}) => api.get(`${ROOT_ROUTE}/options`, { params });
const getUserInfo = () => api.get(`${ROOT_ROUTE}/info`);
const toggleUsersActive = (data = {}) => api.put(`${ROOT_ROUTE}/activate-status`, data);
const exportUsers = (params = {}) => exportExcel({ url: `${ROOT_ROUTE}/export`, fileName: 'users', params });
const importUrl = `${ROOT_ROUTE}/import`;

export {
  createUser,
  updateUser,
  getUserList,
  getUserDetail,
  deleteUsers,
  getUserOptions,
  getUserInfo,
  toggleUsersActive,
  exportUsers,
  importUrl,
};
