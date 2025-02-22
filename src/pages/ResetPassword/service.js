import { api } from 'common/utils/api.util';

const prefix = `/auth`;
const resetPassword = (data = {}) => api.post(`${prefix}/reset-password`, data);

export { resetPassword };
