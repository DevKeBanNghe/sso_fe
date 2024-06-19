import { getPermissionOptions } from '../service';
import useSelectOptions from 'hooks/useSelectOptions';

export default function usePermissionOptions({ params = {} } = {}) {
  const { fetchOptions } = useSelectOptions({
    func: getPermissionOptions,
    key_value: 'permission_id',
    key_label: 'permission_name',
  });
  const fetchPermissionOptions = async (value) => fetchOptions({ permission_name: value, ...params });

  return { fetchOptions: fetchPermissionOptions };
}
