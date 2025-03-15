import { lazy } from 'react';
import { PERMISSION_KEYS } from './const';

const ResetPassword = lazy(() => import('./pages'));

const resetPasswordRouters = [
  {
    path: '/reset-password',
    permissions: [PERMISSION_KEYS.VIEW_RESET_PASSWORD_PERMISSION],
    component: ResetPassword,
  },
];

export default resetPasswordRouters;
