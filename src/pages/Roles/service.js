import { _delete, get, post, put } from 'common/utils/api.util';
import { ROOT_ROUTE } from './const';

const createRole = (data = {}) => post(`${ROOT_ROUTE}`, data);
const updateRole = (data = {}) => put(`${ROOT_ROUTE}`, data);
const getRoleList = (params = {}) => get(`${ROOT_ROUTE}`, { params });
const getRoleDetail = (id) => get(`${ROOT_ROUTE}/${id}`);
const deleteRoles = (params) => _delete(`${ROOT_ROUTE}`, { params });
const getRoleOptions = (params = {}) => get(`${ROOT_ROUTE}/options`, { params });

export { createRole, updateRole, getRoleList, getRoleDetail, deleteRoles, getRoleOptions };
