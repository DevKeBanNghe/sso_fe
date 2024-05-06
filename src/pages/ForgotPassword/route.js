import React from 'react';
const ForgotPassword = React.lazy(() => import('./pages'));
const NotificationReset = React.lazy(() => import('./pages/NotificationReset'));

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
