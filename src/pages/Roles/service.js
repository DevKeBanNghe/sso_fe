import { deleteApi, getApi, postApi, putApi } from 'common/utils/index';
import { ROOT_ROUTE } from './const';

const createRole = (data = {}) => postApi(`${ROOT_ROUTE}`, data);
const updateRole = (data = {}) => putApi(`${ROOT_ROUTE}`, data);
const getRoleList = (params = {}) => getApi(`${ROOT_ROUTE}`, { params });
const getRoleDetail = (id) => getApi(`${ROOT_ROUTE}/${id}`);
const deleteRoles = (params) => deleteApi(`${ROOT_ROUTE}`, { params });
const getRoleOptions = (params = {}) => getApi(`${ROOT_ROUTE}/options`, { params });

export { createRole, updateRole, getRoleList, getRoleDetail, deleteRoles, getRoleOptions };
