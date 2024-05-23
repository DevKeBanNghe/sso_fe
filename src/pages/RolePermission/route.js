import React from 'react';
import { ROOT_ROUTE } from './const';
const RolePermission = React.lazy(() => import('./pages'));

const rolePermissionRouters = [
  {
    path: ROOT_ROUTE,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: RolePermission,
    is_tab: true,
  },
];

export default rolePermissionRouters;
