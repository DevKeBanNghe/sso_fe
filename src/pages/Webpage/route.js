import { lazy } from 'react';
import { PERMISSION_KEYS, ROOT_ROUTE } from './const';
const Webpages = lazy(() => import('./pages'));

const webpagesRouters = [
  {
    path: ROOT_ROUTE,
    permissions: [PERMISSION_KEYS.VIEW_WEBPAGE_PERMISSION],
    component: Webpages,
    is_tab: true,
  },
  {
    path: `${ROOT_ROUTE}/:id`,
    permissions: [PERMISSION_KEYS.VIEW_WEBPAGE_PERMISSION],
    component: Webpages,
  },
  {
    path: `${ROOT_ROUTE}/edit/:id`,
    permissions: [PERMISSION_KEYS.UPDATE_WEBPAGE_PERMISSION],
    component: Webpages,
  },
  {
    path: `${ROOT_ROUTE}/copy/:id`,
    permissions: [PERMISSION_KEYS.CREATE_WEBPAGE_PERMISSION],
    component: Webpages,
  },
];

export default webpagesRouters;
