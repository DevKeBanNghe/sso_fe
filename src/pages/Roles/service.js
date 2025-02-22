import { api } from 'common/utils/api.util';
import { ROOT_ROUTE } from './const';

const createRole = (data = {}) => api.post(`${ROOT_ROUTE}`, data);
const updateRole = (data = {}) => api.put(`${ROOT_ROUTE}`, data);
const getRoleList = (params = {}) => api.get(`${ROOT_ROUTE}`, { params });
const getRoleDetail = (id) => api.get(`${ROOT_ROUTE}/${id}`);
const deleteRoles = (params = {}) => api.delete(`${ROOT_ROUTE}`, { params });
const getRoleOptions = (params = {}) => api.get(`${ROOT_ROUTE}/options`, { params });
const toggleRolesActive = (data = {}) => api.put(`${ROOT_ROUTE}/activate-status`, data);

export { createRole, updateRole, getRoleList, getRoleDetail, deleteRoles, getRoleOptions, toggleRolesActive };
