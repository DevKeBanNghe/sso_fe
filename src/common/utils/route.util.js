import { upperFirst } from 'lodash';

const genRouteNameDefault = (path) => {
  const currentRootRouteIndex = path.indexOf(import.meta.env.VITE_APP_PREFIX, 1);
  const routeNameDefault = currentRootRouteIndex >= 0 ? path.slice(1, currentRootRouteIndex) : path.slice(1);
  return routeNameDefault
    .split('-')
    .map((item) => upperFirst(item))
    .join(' ');
};

export { genRouteNameDefault };
