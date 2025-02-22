import { lazy } from 'react';
const SignIn = lazy(() => import('./pages'));

const signInRouters = [
  {
    path: '/sign-in',
    permission: 'SYS_ALL',
    component: SignIn,
  },
];

export default signInRouters;
