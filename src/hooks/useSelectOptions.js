import { useQueryClient } from '@tanstack/react-query';
import { SELECT_LIMIT_OPTIONS } from 'common/consts/constants.const';
import { transferToOptionSelect } from 'common/utils/select.util';

export default function useSelectOptions({ func = () => {}, key_value = 'id', key_label = 'name' } = {}) {
  const queryClient = useQueryClient();
  const fetchOptions = async (value) => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['options', JSON.stringify(value)],
      queryFn: () => func({ limit: SELECT_LIMIT_OPTIONS, ...value }),
    });
    return transferToOptionSelect({ data, value: key_value, label: key_label });
  };

  return { fetchOptions };
}
