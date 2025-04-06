import { api } from 'common/utils/api.util';
import { ROOT_ROUTE } from './const';
import { exportExcel } from 'common/utils/excel.util';

const updateRolePermission = (data = {}) => api.put(`${ROOT_ROUTE}`, data);
const getRolePermissionList = (data = {}) => api.post(`${ROOT_ROUTE}`, data);
const exportRolePermissionList = (params = {}) =>
  exportExcel({ url: `${ROOT_ROUTE}/export`, fileName: 'role_permission', params });
const importUrl = `${ROOT_ROUTE}/import`;

export { updateRolePermission, getRolePermissionList, exportRolePermissionList, importUrl };
