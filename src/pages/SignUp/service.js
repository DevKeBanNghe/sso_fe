import { post } from 'common/utils/api.util';

const prefix = `/auth`;
const signUp = (data = {}) => post(`${prefix}/sign-up`, data);
export { signUp };
