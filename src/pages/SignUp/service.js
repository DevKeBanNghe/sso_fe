import { postApi } from 'common/utils/index';

const prefix = `/auth`;
export const signUp = (body = {}) => postApi(`${prefix}/sign-up`, body);
