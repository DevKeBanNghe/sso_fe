import React from 'react';
import { ROOT_ROUTE } from './const';
const GroupPermission = React.lazy(() => import('./pages'));

const groupPermissionRouters = [
  {
    path: ROOT_ROUTE,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: GroupPermission,
    is_tab: true,
  },
  {
    path: `${ROOT_ROUTE}/:id`,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: GroupPermission,
  },
  {
    path: `${ROOT_ROUTE}/edit/:id`,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: GroupPermission,
  },
  {
    path: `${ROOT_ROUTE}/copy/:id`,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: GroupPermission,
  },
];

export default groupPermissionRouters;
