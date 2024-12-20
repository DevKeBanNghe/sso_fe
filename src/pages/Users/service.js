import { _delete, get, post, put } from 'common/utils/api.util';
import { ROOT_ROUTE } from './const';

const createUser = (data = {}) => post(`${ROOT_ROUTE}`, data);
const updateUser = (data = {}) => put(`${ROOT_ROUTE}`, data);
const getUserList = (params = {}) => get(`${ROOT_ROUTE}`, { params });
const getUserDetail = (id) => get(`${ROOT_ROUTE}/${id}`);
const deleteUsers = (params) => _delete(`${ROOT_ROUTE}`, { params });
const getUserOptions = (params = {}) => get(`${ROOT_ROUTE}/options`, { params });
const getUserInfo = () => get(`${ROOT_ROUTE}/info`);

export { createUser, updateUser, getUserList, getUserDetail, deleteUsers, getUserOptions, getUserInfo };
