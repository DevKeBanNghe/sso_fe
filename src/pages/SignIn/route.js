import { lazy } from 'react';
import { PERMISSION_KEYS } from './const';
const SignIn = lazy(() => import('./pages'));

const signInRouters = [
  {
    path: '/sign-in',
    permissions: [PERMISSION_KEYS.VIEW_SIGN_IN],
    component: SignIn,
  },
];

export default signInRouters;
