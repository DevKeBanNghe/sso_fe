import { api } from 'common/utils/api.util';

const prefix = `/auth`;
const forgotPassword = (data = {}) => api.post(`${prefix}/forgot-password`, data);

export { forgotPassword };
