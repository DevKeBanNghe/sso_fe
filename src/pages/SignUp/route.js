import React from 'react';
const SignUp = React.lazy(() => import('./pages'));

const routes = [
  {
    path: '/sign-up',
    exact: true,
    name: 'Danh sách thông báo',
    permission: 'SYS_ANNOUNCE_VIEW',
    component: SignUp,
  },
];

export default routes;
