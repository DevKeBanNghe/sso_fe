import React from 'react';
const SignUp = React.lazy(() => import('./pages'));

const routes = [
  {
    path: '/sign-up',
    permission: 'SYS_ANNOUNCE_VIEW',
    component: SignUp,
  },
];

export default routes;
