import { lazy } from 'react';

const SignUp = lazy(() => import('./pages'));

const signUpRouters = [
  {
    path: '/sign-up',
    permission: 'SYS_ANNOUNCE_VIEW',
    component: SignUp,
  },
];

export default signUpRouters;
