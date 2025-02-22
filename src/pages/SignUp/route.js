import { lazy } from 'react';

const SignUp = lazy(() => import('./pages'));

const signUpRouters = [
  {
    path: '/sign-up',
    permission: 'SYS_ALL',
    component: SignUp,
  },
];

export default signUpRouters;
