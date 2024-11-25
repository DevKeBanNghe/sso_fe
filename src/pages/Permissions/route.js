import { lazy } from 'react';
import { ROOT_ROUTE } from './const';
const Permissions = lazy(() => import('./pages'));

const permissionsRouters = [
  {
    path: ROOT_ROUTE,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: Permissions,
    is_tab: true,
  },
  {
    path: `${ROOT_ROUTE}/:id`,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: Permissions,
  },
  {
    path: `${ROOT_ROUTE}/edit/:id`,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: Permissions,
  },
  {
    path: `${ROOT_ROUTE}/copy/:id`,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: Permissions,
  },
];

export default permissionsRouters;
