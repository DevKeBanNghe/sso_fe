import { post } from 'common/utils/index';

const prefix = `/auth`;
const signUp = (data = {}) => post(`${prefix}/sign-up`, data);
export { signUp };
