import { get, put } from 'common/utils/index';
import { ROOT_ROUTE } from './const';

const updateRolePermission = (data = {}) => put(`${ROOT_ROUTE}`, data);
const getRolePermissionList = () => get(`${ROOT_ROUTE}`);

export { updateRolePermission, getRolePermissionList };
