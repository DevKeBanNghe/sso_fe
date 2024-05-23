import { useQuery } from '@tanstack/react-query';
import { STALE_TIME_GET_LIST } from 'common/consts/react-query.const';
import useCurrentPage from 'hooks/useCurrentPage';
import useQueryKeys from 'hooks/useQueryKeys';
import { getRoleList } from '../service';

export default function useRoleList() {
  const { keyList } = useQueryKeys();
  const { queryParams } = useCurrentPage();
  const queryKeyRoleList = `${keyList}-${queryParams.page}`;
  const { data = {}, ...query } = useQuery({
    queryKey: [queryKeyRoleList],
    queryFn: async () => {
      const { data } = await getRoleList(queryParams);
      return data;
    },
    staleTime: STALE_TIME_GET_LIST,
  });

  return {
    data,
    ...query,
    queryKeyRoleList,
  };
}
