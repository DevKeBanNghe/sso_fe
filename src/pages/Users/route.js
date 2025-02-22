import { lazy } from 'react';
import { ROOT_ROUTE } from './const';
const Users = lazy(() => import('./pages'));

const usersRouters = [
  {
    path: ROOT_ROUTE,
    permission: 'SYS_ALL',
    component: Users,
    is_tab: true,
  },
  {
    path: `${ROOT_ROUTE}/:id`,
    permission: 'SYS_ALL',
    component: Users,
  },
  {
    path: `${ROOT_ROUTE}/edit/:id`,
    permission: 'SYS_ALL',
    component: Users,
  },
  {
    path: `${ROOT_ROUTE}/copy/:id`,
    permission: 'SYS_ALL',
    component: Users,
  },
];

export default usersRouters;
