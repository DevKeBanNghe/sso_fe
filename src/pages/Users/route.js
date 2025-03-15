import { lazy } from 'react';
import { PERMISSION_KEYS, ROOT_ROUTE } from './const';
const Users = lazy(() => import('./pages'));

const usersRouters = [
  {
    path: ROOT_ROUTE,
    permissions: [PERMISSION_KEYS.VIEW_USER_PERMISSION],
    component: Users,
    is_tab: true,
  },
  {
    path: `${ROOT_ROUTE}/:id`,
    permissions: [PERMISSION_KEYS.VIEW_USER_PERMISSION],
    component: Users,
  },
  {
    path: `${ROOT_ROUTE}/edit/:id`,
    permissions: [PERMISSION_KEYS.UPDATE_USER_PERMISSION],
    component: Users,
  },
  {
    path: `${ROOT_ROUTE}/copy/:id`,
    permissions: [PERMISSION_KEYS.CREATE_USER_PERMISSION],
    component: Users,
  },
];

export default usersRouters;
