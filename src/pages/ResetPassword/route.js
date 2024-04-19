import React from 'react';
const ResetPassword = React.lazy(() => import('./pages'));

const routes = [
  {
    path: '/reset-password',
    exact: true,
    name: 'Danh sách thông báo',
    permission: 'SYS_ANNOUNCE_VIEW',
    component: ResetPassword,
  },
];

export default routes;
