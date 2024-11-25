import { post } from 'common/utils/api.util';

const prefix = `/auth`;
const resetPassword = (data = {}) => post(`${prefix}/reset-password`, data);

export { resetPassword };
