import { postApi } from 'common/utils/index';

const prefix = `/auth`;
const signUp = (data = {}) => postApi(`${prefix}/sign-up`, data);
export { signUp };
