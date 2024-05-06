import { useMemo } from 'react';
import { routers } from 'routers';
import useCurrentPage from './useCurrentPage';
import useUser from './useUser';

export default function useAuth() {
  const user = useUser();
  const { currentRootRoute, currentRoute, params } = useCurrentPage({ isPaging: false });

  const pathHasParams = useMemo(() => {
    let routeHasParams = currentRoute;
    for (const [key, value] of Object.entries(params)) {
      routeHasParams = routeHasParams.replace(value, `:${key}`);
    }
    return routeHasParams;
  }, [params, currentRoute]);

  const isAllowed = useMemo(() => {
    return routers.some((router) => {
      return (
        router.path === pathHasParams &&
        router.path.includes(currentRootRoute) &&
        user.permissions.includes(router.permission)
      );
    });
  }, [user, pathHasParams]);

  return { isAllowed };
}
