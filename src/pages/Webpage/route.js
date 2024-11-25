import { lazy } from 'react';
import { ROOT_ROUTE } from './const';
const Webpages = lazy(() => import('./pages'));

const webpagesRouters = [
  {
    path: ROOT_ROUTE,
    permission: 'SYS_WEBPAGE_UPDATE',
    component: Webpages,
    is_tab: true,
  },
  {
    path: `${ROOT_ROUTE}/:id`,
    permission: 'SYS_WEBPAGE_VIEW_DETAIL',
    component: Webpages,
  },
  {
    path: `${ROOT_ROUTE}/edit/:id`,
    permission: 'SYS_WEBPAGE_UPDATE',
    component: Webpages,
  },
  {
    path: `${ROOT_ROUTE}/copy/:id`,
    permission: 'SYS_WEBPAGE_COPY',
    component: Webpages,
  },
];

export default webpagesRouters;
