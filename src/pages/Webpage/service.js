import { api } from 'common/utils/api.util';
import { ROOT_ROUTE } from './const';

const createWebpage = (data = {}) => api.post(`${ROOT_ROUTE}`, data);
const updateWebpage = (data = {}) => api.put(`${ROOT_ROUTE}`, data);
const getWebpageList = (params = {}) => api.get(`${ROOT_ROUTE}`, { params });
const getWebpageDetail = (id) => api.get(`${ROOT_ROUTE}/${id}`);
const deleteWebpages = (params) => api.delete(`${ROOT_ROUTE}`, { params });

export { createWebpage, updateWebpage, getWebpageList, getWebpageDetail, deleteWebpages };
