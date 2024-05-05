import { deleteApi, getApi, postApi, putApi } from 'common/utils/index';
import { ROOT_ROUTE } from './const';

const createWebpage = (data = {}) => postApi(`${ROOT_ROUTE}`, data);
const getWebPageOptions = (params = {}) => getApi(`${ROOT_ROUTE}/options`, { params });
const updateWebpage = (data = {}) => putApi(`${ROOT_ROUTE}`, data);
const getWebpageList = (params = {}) => getApi(`${ROOT_ROUTE}`, { params });
const getWebpageDetail = (id) => getApi(`${ROOT_ROUTE}/${id}`);
const deleteWebpages = (params) => deleteApi(`${ROOT_ROUTE}`, { params });

export { createWebpage, getWebPageOptions, updateWebpage, getWebpageList, getWebpageDetail, deleteWebpages };
