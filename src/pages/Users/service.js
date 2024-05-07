import { deleteApi, getApi, postApi, putApi } from 'common/utils/index';
import { ROOT_ROUTE } from './const';

const createUser = (data = {}) => postApi(`${ROOT_ROUTE}`, data);
const updateUser = (data = {}) => putApi(`${ROOT_ROUTE}`, data);
const getUserList = (params = {}) => getApi(`${ROOT_ROUTE}`, { params });
const getUserDetail = (id) => getApi(`${ROOT_ROUTE}/${id}`);
const deleteUsers = (params) => deleteApi(`${ROOT_ROUTE}`, { params });
const getUserOptions = (params = {}) => getApi(`${ROOT_ROUTE}/options`, { params });

export { createUser, updateUser, getUserList, getUserDetail, deleteUsers, getUserOptions };
