import { api } from 'common/utils/api.util';

const prefix = `/auth`;
const signUp = (data = {}) => api.post(`${prefix}/sign-up`, data);
export { signUp };
