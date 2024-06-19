import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { deletePermissions, getPermissionList } from '../service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import useGetList from 'hooks/useGetList';
import { columns } from './PermissionColumnTable';

function PermissionTable() {
  const navigate = useNavigate();
  const { keyList } = useQueryKeys();
  const queryClient = useQueryClient();
  const { id: currentPermissionId, currentRootRoute, queryParams, queryParamsString } = useCurrentPage();

  const mutationDeletePermissions = useMutation({
    mutationFn: deletePermissions,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(parseInt(currentPermissionId))) {
        return navigate(`${currentRootRoute}${queryParamsString}`);
      }
      await queryClient.fetchQuery({
        queryKey: [`${keyList}-${queryParams.page}`],
      });
    },
  });

  const handleDeleteAll = async (ids = []) => {
    mutationDeletePermissions.mutate({ ids });
  };

  const {
    data: { totalItems, itemPerPage, list, page },
  } = useGetList({ func: getPermissionList });

  return (
    <CTTable
      rowKey={'permission_id'}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      currentPage={page}
      columns={columns}
      onGlobalDelete={handleDeleteAll}
    />
  );
}

export default PermissionTable;
