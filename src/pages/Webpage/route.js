import React from 'react';
import { ROOT_ROUTE } from './const';
const Webpages = React.lazy(() => import('./pages'));

const webpagesRouters = [
  {
    path: ROOT_ROUTE,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: Webpages,
    is_tab: true,
  },
  {
    path: `${ROOT_ROUTE}/:id`,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: Webpages,
  },
  {
    path: `${ROOT_ROUTE}/edit/:id`,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: Webpages,
  },
  {
    path: `${ROOT_ROUTE}/copy/:id`,
    permission: 'SYS_ANNOUNCE_VIEW',
    component: Webpages,
  },
];

export default webpagesRouters;
