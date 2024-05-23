import { getApi, putApi } from 'common/utils/index';
import { ROOT_ROUTE } from './const';

const updateRolePermission = (data = {}) => putApi(`${ROOT_ROUTE}`, data);
const getRolePermissionList = () => getApi(`${ROOT_ROUTE}`);

export { updateRolePermission, getRolePermissionList };
