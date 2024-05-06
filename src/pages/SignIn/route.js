import React from 'react';
const SignIn = React.lazy(() => import('./pages'));

const signInRouters = [
  {
    path: '/sign-in',
    permission: 'SYS_ANNOUNCE_VIEW',
    component: SignIn,
  },
];

export default signInRouters;
