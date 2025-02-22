import { api } from 'common/utils/api.util';
import { ROOT_ROUTE } from './const';

const updateRolePermission = (data = {}) => api.put(`${ROOT_ROUTE}`, data);
const getRolePermissionList = (data = {}) => api.post(`${ROOT_ROUTE}`, data);

export { updateRolePermission, getRolePermissionList };
