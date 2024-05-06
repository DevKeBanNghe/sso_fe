import { postApi } from 'common/utils/index';

const prefix = `/auth`;
const forgotPassword = (data = {}) => postApi(`${prefix}/forgot-password`, data);

export { forgotPassword };
