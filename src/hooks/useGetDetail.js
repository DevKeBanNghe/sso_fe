import useQueryKeys from './useQueryKeys';
import useCurrentPage from './useCurrentPage';
import { useQuery } from '@tanstack/react-query';

export default function useGetDetail({ func = () => {} }) {
  const { keyDetail } = useQueryKeys();
  const { id } = useCurrentPage({ isPaging: false });
  const { data: queryDetail = {} } = useQuery({
    queryKey: [keyDetail, id],
    queryFn: () => func(id),
    enabled: id ? true : false,
  });
  return queryDetail;
}
