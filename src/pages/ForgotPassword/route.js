import { lazy } from 'react';
import { PERMISSION_KEYS } from './const';

const ForgotPassword = lazy(() => import('./pages'));
const NotificationReset = lazy(() => import('./pages/NotificationReset'));

const forgotPasswordRouters = [
  {
    path: '/forgot-password',
    permissions: [PERMISSION_KEYS.VIEW_FORGOT_PASSWORD],
    component: ForgotPassword,
  },
  {
    path: '/notification-reset',
    permissions: [PERMISSION_KEYS.VIEW_NOTIFICATION_RESET],
    component: NotificationReset,
  },
];

export default forgotPasswordRouters;
