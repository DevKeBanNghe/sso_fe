import { api } from 'common/utils/api.util';
import { ROOT_ROUTE } from './const';
import { exportExcel } from 'common/utils/excel.util';

const createPermission = (data = {}) => api.post(`${ROOT_ROUTE}`, data);
const updatePermission = (data = {}) => api.put(`${ROOT_ROUTE}`, data);
const getPermissionList = (params = {}) => api.get(`${ROOT_ROUTE}`, { params });
const getPermissionDetail = (id) => api.get(`${ROOT_ROUTE}/${id}`);
const deletePermissions = (params) => api.delete(`${ROOT_ROUTE}`, { params });
const getPermissionOptions = (params = {}) => api.get(`${ROOT_ROUTE}/options`, { params });
const getPermissionActionsOptions = (params = {}) => api.get(`${ROOT_ROUTE}/action-options`, { params });
const getHttpMethodOptions = (params = {}) => api.get(`${ROOT_ROUTE}/http-method-options`, { params });
const togglePermissionsActive = (data = {}) => api.put(`${ROOT_ROUTE}/activate-status`, data);
const exportPermissions = (params = {}) =>
  exportExcel({ url: `${ROOT_ROUTE}/export`, fileName: 'permissions', params });
const importUrl = `${ROOT_ROUTE}/import`;

export {
  createPermission,
  updatePermission,
  getPermissionList,
  getPermissionDetail,
  deletePermissions,
  getPermissionOptions,
  getPermissionActionsOptions,
  getHttpMethodOptions,
  togglePermissionsActive,
  exportPermissions,
  importUrl,
};
