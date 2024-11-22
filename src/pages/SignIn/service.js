import { post } from 'common/utils/index';

const prefix = `/auth`;
const signIn = (data = {}) => post(`${prefix}/sign-in`, data);

export { signIn };
