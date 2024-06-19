import useQueryKeys from './useQueryKeys';
import useCurrentPage from './useCurrentPage';
import { useQuery } from '@tanstack/react-query';
import { STALE_TIME_GET_LIST } from 'common/consts/react-query.const';

export default function useGetList({ func = async () => {} }) {
  const { keyList } = useQueryKeys();
  const { queryParams } = useCurrentPage();
  const queryKey = `${keyList}-${queryParams.page}`;
  const { data = {}, ...query } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data } = await func(queryParams);
      return data;
    },
    staleTime: STALE_TIME_GET_LIST,
  });
  return { data, queryKey, ...query };
}
