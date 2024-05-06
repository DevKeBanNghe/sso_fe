import { postApi } from 'common/utils/index';

const prefix = `/auth`;
const signIn = (data = {}) => postApi(`${prefix}/sign-in`, data);

export { signIn };
