import { lazy } from 'react';

const ForgotPassword = lazy(() => import('./pages'));
const NotificationReset = lazy(() => import('./pages/NotificationReset'));

const forgotPasswordRouters = [
  {
    path: '/forgot-password',
    permission: 'SYS_ANNOUNCE_VIEW',
    component: ForgotPassword,
  },
  {
    path: '/notification-reset',
    permission: 'SYS_ANNOUNCE_VIEW',
    component: NotificationReset,
  },
];

export default forgotPasswordRouters;
