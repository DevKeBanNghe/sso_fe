import { api } from 'common/utils/api.util';

const prefix = `/auth`;
const signIn = (data = {}) => api.post(`${prefix}/sign-in`, data);
const logout = () => api.get(`/auth/logout`);

export { signIn, logout };
