import { getRoleOptions } from '../service';
import useSelectOptions from 'hooks/useSelectOptions';

export default function useRoleOptions({ params = {} } = {}) {
  const { fetchOptions } = useSelectOptions({
    func: getRoleOptions,
    key_value: 'role_id',
    key_label: 'role_name',
  });
  const fetchRoleOptions = async (value) => fetchOptions({ role_name: value, ...params });

  return { fetchOptions: fetchRoleOptions };
}
