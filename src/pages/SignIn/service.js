import { getApi, postApi } from 'common/utils/index';

const prefix = `/auth`;
export const signIn = (body = {}) => postApi(`${prefix}/sign-in`, body);
export const getAllUser = () => getApi(`/users`);
