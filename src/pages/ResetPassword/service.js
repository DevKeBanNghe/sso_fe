import { post } from 'common/utils/index';

const prefix = `/auth`;
const resetPassword = (data = {}) => post(`${prefix}/reset-password`, data);

export { resetPassword };
