import { lazy } from 'react';
import { ROOT_ROUTE } from './const';
const Roles = lazy(() => import('./pages'));

const rolesRouters = [
  {
    path: ROOT_ROUTE,
    permission: 'SYS_ALL',
    component: Roles,
    is_tab: true,
  },
  {
    path: `${ROOT_ROUTE}/:id`,
    permission: 'SYS_ALL',
    component: Roles,
  },
  {
    path: `${ROOT_ROUTE}/edit/:id`,
    permission: 'SYS_ALL',
    component: Roles,
  },
  {
    path: `${ROOT_ROUTE}/copy/:id`,
    permission: 'SYS_ALL',
    component: Roles,
  },
];

export default rolesRouters;
