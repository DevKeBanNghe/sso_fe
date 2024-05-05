import { deleteApi, getApi, postApi, putApi } from 'common/utils/index';
import { ROOT_ROUTE } from './const';

const getGroupRoleOptions = (params = {}) => getApi(`${ROOT_ROUTE}/options`, { params });
const createGroupRole = (data = {}) => postApi(`${ROOT_ROUTE}`, data);
const updateGroupRole = (data = {}) => putApi(`${ROOT_ROUTE}`, data);
const getGroupRoleList = (params = {}) => getApi(`${ROOT_ROUTE}`, { params });
const getGroupRoleDetail = (id) => getApi(`${ROOT_ROUTE}/${id}`);
const deleteGroupRole = (params) => deleteApi(`${ROOT_ROUTE}`, { params });

export { getGroupRoleOptions, createGroupRole, updateGroupRole, getGroupRoleList, getGroupRoleDetail, deleteGroupRole };
