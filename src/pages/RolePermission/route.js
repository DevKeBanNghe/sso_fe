import { lazy } from 'react';
import { PERMISSION_KEYS, ROOT_ROUTE } from './const';
const RolePermission = lazy(() => import('./pages'));

const rolePermissionRouters = [
  {
    path: ROOT_ROUTE,
    permissions: [PERMISSION_KEYS.VIEW_ROLE_AND_PERMISSION],
    component: RolePermission,
    is_tab: true,
  },
];

export default rolePermissionRouters;
