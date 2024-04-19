import { postApi } from 'common/utils/index';

const prefix = `/auth`;
export const resetPassword = (body = {}) => postApi(`${prefix}/reset-password`, body);
