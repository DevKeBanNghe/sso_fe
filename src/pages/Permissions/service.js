import { _delete, get, post, put } from 'common/utils/api.util';
import { ROOT_ROUTE } from './const';

const createPermission = (data = {}) => post(`${ROOT_ROUTE}`, data);
const updatePermission = (data = {}) => put(`${ROOT_ROUTE}`, data);
const getPermissionList = (params = {}) => get(`${ROOT_ROUTE}`, { params });
const getPermissionDetail = (id) => get(`${ROOT_ROUTE}/${id}`);
const deletePermissions = (params) => _delete(`${ROOT_ROUTE}`, { params });
const getPermissionOptions = (params = {}) => get(`${ROOT_ROUTE}/options`, { params });

export {
  createPermission,
  updatePermission,
  getPermissionList,
  getPermissionDetail,
  deletePermissions,
  getPermissionOptions,
};
