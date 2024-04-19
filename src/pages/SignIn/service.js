import { postApi } from 'common/utils/index';

const prefix = `/auth`;
export const signIn = (body = {}) => postApi(`${prefix}/sign-in`, body);
export const forgotPassword = (body = {}) => postApi(`${prefix}/forgot-password`, body);
