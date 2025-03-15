import { lazy } from 'react';
import { PERMISSION_KEYS, ROOT_ROUTE } from './const';
const Permissions = lazy(() => import('./pages'));

const permissionsRouters = [
  {
    path: ROOT_ROUTE,
    permissions: [PERMISSION_KEYS.VIEW_PERMISSION],
    component: Permissions,
    is_tab: true,
  },
  {
    path: `${ROOT_ROUTE}/:id`,
    permissions: [PERMISSION_KEYS.VIEW_PERMISSION],
    component: Permissions,
  },
  {
    path: `${ROOT_ROUTE}/edit/:id`,
    permissions: [PERMISSION_KEYS.UPDATE_PERMISSION],
    component: Permissions,
  },
  {
    path: `${ROOT_ROUTE}/copy/:id`,
    permissions: [PERMISSION_KEYS.CREATE_PERMISSION],
    component: Permissions,
  },
];

export default permissionsRouters;
