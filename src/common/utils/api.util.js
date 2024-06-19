import axios, { HttpStatusCode } from 'axios';
import { getUserInfo } from 'common/reducers/user.action';
import { store } from 'reduxApp/store';
const API_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use((req) => {
  return req;
});

instance.interceptors.response.use(
  ({ data: data_res, status }) => {
    return { ...data_res, status };
  },
  async ({ response: { data, status } }) => {
    const { data: dataRes } = data ?? {};
    if (status === HttpStatusCode.Unauthorized && !dataRes?.isRefresh) {
      const { errors } = await instance.get(`auth/refresh-token`);
      if (errors) throw new Error(errors.toString());
      store.dispatch(getUserInfo());
    }
    return { ...data, status };
  },
);

const { get: getApi, patch: patchApi, post: postApi, put: putApi, delete: deleteApi } = instance;

export { getApi, patchApi, postApi, putApi, deleteApi };
