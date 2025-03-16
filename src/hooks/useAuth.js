import { useMemo } from 'react';
import useCurrentPage from './useCurrentPage';
import useUser from './useUser';
import { routers } from 'routers';

export default function useAuth() {
  const user = useUser();
  const { currentRootRoute } = useCurrentPage({ isPaging: false });

  const isAllowed = useMemo(() => {
    if (user.is_supper_admin) return true;

    if (!user.user_name) return false;

    for (const router of routers) {
      if (router.path.includes(currentRootRoute)) {
        const isValidPermission = router.permissions?.some((permission) => user.permissions.includes(permission));
        if (isValidPermission) return true;
      }
    }

    return false;
  }, [user]);

  return { isAllowed };
}
