import React from 'react';
import { ROOT_ROUTE } from './const';
const GroupRole = React.lazy(() => import('./pages'));

const groupRoleRouters = [
  {
    path: ROOT_ROUTE,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: GroupRole,
    is_tab: true,
  },
  {
    path: `${ROOT_ROUTE}/:id`,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: GroupRole,
  },
  {
    path: `${ROOT_ROUTE}/edit/:id`,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: GroupRole,
  },
  {
    path: `${ROOT_ROUTE}/copy/:id`,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: GroupRole,
  },
];

export default groupRoleRouters;
