import useQueryKeys from './useQueryKeys';
import useCurrentPage from './useCurrentPage';
import { useQuery } from '@tanstack/react-query';
import { isFunction } from 'lodash';

export default function useGetDetail({ func }) {
  const { keyDetail } = useQueryKeys();
  const { id } = useCurrentPage({ isPaging: false });
  const { data: queryDetail = {} } = useQuery({
    queryKey: [keyDetail, id],
    queryFn: () => isFunction(func) && func(id),
    enabled: id && isFunction(func) ? true : false,
  });
  return queryDetail;
}
