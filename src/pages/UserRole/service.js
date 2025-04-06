import { api } from 'common/utils/api.util';
import { ROOT_ROUTE } from './const';
import { exportExcel } from 'common/utils/excel.util';

const updateUserRole = (data = {}) => api.put(`${ROOT_ROUTE}`, data);
const getUserRoleList = (data = {}) => api.post(`${ROOT_ROUTE}`, data);
const exportUserRoleList = (params = {}) => exportExcel({ url: `${ROOT_ROUTE}/export`, fileName: 'user_role', params });
const importUrl = `${ROOT_ROUTE}/import`;

export { updateUserRole, getUserRoleList, exportUserRoleList, importUrl };
