import { lazy } from 'react';
import { ROOT_ROUTE } from './const';
const UserRole = lazy(() => import('./pages'));

const userRoleRouters = [
  {
    path: ROOT_ROUTE,
    user: 'SYS_ALL',
    component: UserRole,
    is_tab: true,
  },
];

export default userRoleRouters;
