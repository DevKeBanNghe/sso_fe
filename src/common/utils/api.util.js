import axios, { HttpStatusCode } from 'axios';
import { getUserInfo } from 'common/reducers/user.action';
import signInRouters from 'pages/SignIn/route';
import signUpRouters from 'pages/SignUp/route';
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
    const isRouteRefreshToken = [...signInRouters, ...signUpRouters].some(
      (route) => route.path !== window.location.pathname,
    );
    const isRefreshToken = status === HttpStatusCode.Unauthorized && isRouteRefreshToken;
    if (isRefreshToken) {
      const { errors } = await instance.get(`auth/refresh-token`);
      if (errors) throw new Error(errors.toString());
      store.dispatch(getUserInfo());
    }
    return { ...data, status };
  },
);

const { get, patch, post, put, delete: _delete } = instance;

export { get, patch, post, put, _delete };
