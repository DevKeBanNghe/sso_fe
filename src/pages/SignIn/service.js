import { postApi } from 'common/utils/index';

const prefix = `/auth`;
const signIn = (data = {}) => postApi(`${prefix}/sign-in`, data);
const forgotPassword = (data = {}) => postApi(`${prefix}/forgot-password`, data);

export { signIn, forgotPassword };
