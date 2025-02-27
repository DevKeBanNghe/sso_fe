import { lazy } from 'react';
import { ROOT_ROUTE } from './const';
const RolePermission = lazy(() => import('./pages'));

const rolePermissionRouters = [
  {
    path: ROOT_ROUTE,
    permission: 'SYS_ALL',
    component: RolePermission,
    is_tab: true,
  },
];

export default rolePermissionRouters;
