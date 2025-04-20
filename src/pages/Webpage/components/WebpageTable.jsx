import CTTable from 'components/shared/CTTable';
import { deleteWebpages, exportWebpages, getWebpageList, toggleWebpagesActive } from '../service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils/toast.util';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import useGetList from 'hooks/useGetList';
import { columns } from './WebpageColumnTable';
import { forwardRef, useImperativeHandle } from 'react';

function WebpageTableRef(props, ref) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: currentWebpageId, currentRootRoute, setQueryParams, queryParamsString } = useCurrentPage();

  const {
    data: { totalItems, itemPerPage, list, page },
    queryKey: queryKeyGetWebpageList,
    isLoading,
  } = useGetList({ func: getWebpageList });

  useImperativeHandle(ref, () => ({
    queryKey: queryKeyGetWebpageList,
  }));

  const mutationDeleteWebpages = useMutation({
    mutationFn: deleteWebpages,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(currentWebpageId)) {
        return navigate(`${currentRootRoute}${queryParamsString}`);
      }
      await queryClient.invalidateQueries({
        queryKey: queryKeyGetWebpageList,
      });
    },
  });

  const mutationToggleWebpagesActive = useMutation({
    mutationFn: toggleWebpagesActive,
    onSuccess: async ({ errors }) => {
      if (errors) return toast.error(errors);
      toast.success('Update activate status success!');
      await queryClient.invalidateQueries({
        queryKey: queryKeyGetWebpageList,
      });
    },
  });

  const handleToggleWebpagesActive = async ({ ids = [], is_active }) =>
    mutationToggleWebpagesActive.mutate({ webpage_ids: ids, is_active });

  const handleDeleteAll = async (ids = []) => mutationDeleteWebpages.mutate({ ids });

  const handleExportExcel = async (ids = []) => exportWebpages({ ids });

  return (
    <CTTable
      rowKey={'webpage_id'}
      loading={isLoading}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      columns={columns}
      currentPage={page}
      onGlobalDelete={handleDeleteAll}
      onGlobalToggleActive={handleToggleWebpagesActive}
      onGlobalExport={handleExportExcel}
    />
  );
}

const WebpageTable = forwardRef(WebpageTableRef);

export default WebpageTable;
