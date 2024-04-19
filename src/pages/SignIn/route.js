import React from 'react';
const SignIn = React.lazy(() => import('./pages'));

const routes = [
  {
    path: '/sign-in',
    exact: true,
    name: 'Danh sách thông báo',
    permission: 'SYS_ANNOUNCE_VIEW',
    component: SignIn,
  },
];

export default routes;
