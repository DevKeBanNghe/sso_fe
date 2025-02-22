import { lazy } from 'react';

const ForgotPassword = lazy(() => import('./pages'));
const NotificationReset = lazy(() => import('./pages/NotificationReset'));

const forgotPasswordRouters = [
  {
    path: '/forgot-password',
    permission: 'SYS_ALL',
    component: ForgotPassword,
  },
  {
    path: '/notification-reset',
    permission: 'SYS_ALL',
    component: NotificationReset,
  },
];

export default forgotPasswordRouters;
