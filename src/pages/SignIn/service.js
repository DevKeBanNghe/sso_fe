import { post, get } from 'common/utils/api.util';

const prefix = `/auth`;
const signIn = (data = {}) => post(`${prefix}/sign-in`, data);
const logout = () => get(`/auth/logout`);

export { signIn, logout };
