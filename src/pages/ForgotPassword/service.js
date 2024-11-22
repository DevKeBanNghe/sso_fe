import { post } from 'common/utils/index';

const prefix = `/auth`;
const forgotPassword = (data = {}) => post(`${prefix}/forgot-password`, data);

export { forgotPassword };
