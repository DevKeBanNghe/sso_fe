import { lazy } from 'react';
import { PERMISSION_KEYS, ROOT_ROUTE } from './const';
const Roles = lazy(() => import('./pages'));

const rolesRouters = [
  {
    path: ROOT_ROUTE,
    permissions: [PERMISSION_KEYS.VIEW_ROLE_PERMISSION],
    component: Roles,
    is_tab: true,
  },
  {
    path: `${ROOT_ROUTE}/:id`,
    permissions: [PERMISSION_KEYS.VIEW_ROLE_PERMISSION],
    component: Roles,
  },
  {
    path: `${ROOT_ROUTE}/edit/:id`,
    permissions: [PERMISSION_KEYS.UPDATE_ROLE_PERMISSION],
    component: Roles,
  },
  {
    path: `${ROOT_ROUTE}/copy/:id`,
    permissions: [PERMISSION_KEYS.CREATE_ROLE_PERMISSION],
    component: Roles,
  },
];

export default rolesRouters;
