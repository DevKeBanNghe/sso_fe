import { post } from 'common/utils/api.util';

const prefix = `/auth`;
const forgotPassword = (data = {}) => post(`${prefix}/forgot-password`, data);

export { forgotPassword };
