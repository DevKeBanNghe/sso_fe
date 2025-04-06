import { api } from 'common/utils/api.util';
import { ROOT_ROUTE } from './const';
import { exportExcel } from 'common/utils/excel.util';

const createRole = (data = {}) => api.post(`${ROOT_ROUTE}`, data);
const updateRole = (data = {}) => api.put(`${ROOT_ROUTE}`, data);
const getRoleList = (params = {}) => api.get(`${ROOT_ROUTE}`, { params });
const getRoleDetail = (id) => api.get(`${ROOT_ROUTE}/${id}`);
const deleteRoles = (params = {}) => api.delete(`${ROOT_ROUTE}`, { params });
const getRoleOptions = (params = {}) => api.get(`${ROOT_ROUTE}/options`, { params });
const toggleRolesActive = (data = {}) => api.put(`${ROOT_ROUTE}/activate-status`, data);
const exportRoles = (params = {}) => exportExcel({ url: `${ROOT_ROUTE}/export`, fileName: 'roles', params });
const importUrl = `${ROOT_ROUTE}/import`;

export {
  createRole,
  updateRole,
  getRoleList,
  getRoleDetail,
  deleteRoles,
  getRoleOptions,
  toggleRolesActive,
  exportRoles,
  importUrl,
};
