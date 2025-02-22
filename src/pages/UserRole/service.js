import { api } from 'common/utils/api.util';
import { ROOT_ROUTE } from './const';

const updateUserRole = (data = {}) => api.put(`${ROOT_ROUTE}`, data);
const getUserRoleList = (data = {}) => api.post(`${ROOT_ROUTE}`, data);

export { updateUserRole, getUserRoleList };
