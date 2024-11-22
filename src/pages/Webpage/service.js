import { _delete, get, post, put } from 'common/utils/index';
import { ROOT_ROUTE } from './const';

const createWebpage = (data = {}) => post(`${ROOT_ROUTE}`, data);
const updateWebpage = (data = {}) => put(`${ROOT_ROUTE}`, data);
const getWebpageList = (params = {}) => get(`${ROOT_ROUTE}`, { params });
const getWebpageDetail = (id) => get(`${ROOT_ROUTE}/${id}`);
const deleteWebpages = (params) => _delete(`${ROOT_ROUTE}`, { params });

export { createWebpage, updateWebpage, getWebpageList, getWebpageDetail, deleteWebpages };
