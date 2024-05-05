import { deleteApi, getApi, postApi, putApi } from 'common/utils/index';
import { ROOT_ROUTE } from './const';

const getGroupPermissionOptions = (params = {}) => getApi(`${ROOT_ROUTE}/options`, { params });
const createGroupPermission = (data = {}) => postApi(`${ROOT_ROUTE}`, data);
const updateGroupPermission = (data = {}) => putApi(`${ROOT_ROUTE}`, data);
const getGroupPermissionList = (params = {}) => getApi(`${ROOT_ROUTE}`, { params });
const getGroupPermissionDetail = (id) => getApi(`${ROOT_ROUTE}/${id}`);
const deleteGroupPermission = (params) => deleteApi(`${ROOT_ROUTE}`, { params });

export {
  getGroupPermissionOptions,
  createGroupPermission,
  updateGroupPermission,
  getGroupPermissionList,
  getGroupPermissionDetail,
  deleteGroupPermission,
};
