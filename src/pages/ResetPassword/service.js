import { postApi } from 'common/utils/index';

const prefix = `/auth`;
const resetPassword = (data = {}) => postApi(`${prefix}/reset-password`, data);

export { resetPassword };
