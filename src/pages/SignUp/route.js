import { lazy } from 'react';
import { PERMISSION_KEYS } from './const';

const SignUp = lazy(() => import('./pages'));

const signUpRouters = [
  {
    path: '/sign-up',
    permissions: [PERMISSION_KEYS.VIEW_SIGN_UP],
    component: SignUp,
  },
];

export default signUpRouters;
