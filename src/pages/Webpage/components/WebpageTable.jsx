import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { deleteWebpages, getWebpageList } from '../service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils/toast.util';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import useGetList from 'hooks/useGetList';
import { columns } from './WebpageColumnTable';

export default function WebpageTable() {
  const navigate = useNavigate();
  const { keyList } = useQueryKeys();
  const queryClient = useQueryClient();
  const { id: currentWebpageId, currentRootRoute, queryParams, setQueryParams, queryParamsString } = useCurrentPage();

  const mutationDeleteWebpages = useMutation({
    mutationFn: deleteWebpages,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(currentWebpageId)) {
        return navigate(`${currentRootRoute}${queryParamsString}`);
      }
      await queryClient.fetchQuery({
        queryKey: [`${keyList}-${queryParams.page}`],
      });
    },
  });

  const handleDeleteAll = async (ids = []) => mutationDeleteWebpages.mutate({ ids });

  const {
    data: { totalItems, itemPerPage, list, page },
  } = useGetList({ func: getWebpageList });

  return (
    <CTTable
      rowKey={'webpage_id'}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      columns={columns}
      onChange={({ current: page }) => setQueryParams((pre) => ({ ...pre, page }))}
      currentPage={page}
      onGlobalDelete={handleDeleteAll}
    />
  );
}
