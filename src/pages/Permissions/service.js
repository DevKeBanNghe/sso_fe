import { deleteApi, getApi, postApi, putApi } from 'common/utils/index';
import { ROOT_ROUTE } from './const';

const createPermission = (data = {}) => postApi(`${ROOT_ROUTE}`, data);
const updatePermission = (data = {}) => putApi(`${ROOT_ROUTE}`, data);
const getPermissionList = (params = {}) => getApi(`${ROOT_ROUTE}`, { params });
const getPermissionDetail = (id) => getApi(`${ROOT_ROUTE}/${id}`);
const deletePermissions = (params) => deleteApi(`${ROOT_ROUTE}`, { params });
const getPermissionOptions = (params = {}) => getApi(`${ROOT_ROUTE}/options`, { params });

export {
  createPermission,
  updatePermission,
  getPermissionList,
  getPermissionDetail,
  deletePermissions,
  getPermissionOptions,
};
