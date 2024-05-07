import useUser from 'hooks/useUser';
import { isArray, isObject, isString } from 'lodash';
import { useMemo } from 'react';

export default function CheckPermission({ children, permission_keys }) {
  const user = useUser();

  const isValid = useMemo(() => {
    if (isString(permission_keys)) return user.permissions.includes(permission_keys);
    if (isObject(permission_keys)) {
      return Object.values(permission_keys).every((permission_key) => user.permissions.includes(permission_key));
    }
    if (!isArray(permission_keys)) return false;
    return permission_keys.some((permission_key) => user.permissions.includes(permission_key));
  }, [user]);

  return isValid ? children : <></>;
}
