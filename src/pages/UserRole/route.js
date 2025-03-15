import { lazy } from 'react';
import { PERMISSION_KEYS, ROOT_ROUTE } from './const';
const UserRole = lazy(() => import('./pages'));

const userRoleRouters = [
  {
    path: ROOT_ROUTE,
    user: PERMISSION_KEYS.VIEW_USER_AND_ROLE,
    component: UserRole,
    is_tab: true,
  },
];

export default userRoleRouters;
