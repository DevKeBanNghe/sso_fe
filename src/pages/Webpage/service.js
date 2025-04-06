import { api } from 'common/utils/api.util';
import { ROOT_ROUTE } from './const';
import { exportExcel } from 'common/utils/excel.util';

const createWebpage = (data = {}) => api.post(`${ROOT_ROUTE}`, data);
const updateWebpage = (data = {}) => api.put(`${ROOT_ROUTE}`, data);
const getWebpageList = (params = {}) => api.get(`${ROOT_ROUTE}`, { params });
const getWebpageDetail = (id) => api.get(`${ROOT_ROUTE}/${id}`);
const deleteWebpages = (params) => api.delete(`${ROOT_ROUTE}`, { params });
const toggleWebpagesActive = (data = {}) => api.put(`${ROOT_ROUTE}/activate-status`, data);
const exportWebpages = (params = {}) => exportExcel({ url: `${ROOT_ROUTE}/export`, fileName: 'webpages', params });
const importUrl = `${ROOT_ROUTE}/import`;

export {
  createWebpage,
  updateWebpage,
  getWebpageList,
  getWebpageDetail,
  deleteWebpages,
  toggleWebpagesActive,
  exportWebpages,
  importUrl,
};
