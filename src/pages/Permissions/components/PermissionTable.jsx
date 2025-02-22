import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { deletePermissions, getPermissionList } from '../service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils/toast.util';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import useGetList from 'hooks/useGetList';

function PermissionTable() {
  const navigate = useNavigate();
  const { keyList } = useQueryKeys();
  const queryClient = useQueryClient();
  const {
    id: currentPermissionId,
    currentRootRoute,
    queryParams,
    queryParamsString,
    setQueryParams,
  } = useCurrentPage();

  const mutationDeletePermissions = useMutation({
    mutationFn: deletePermissions,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(currentPermissionId)) {
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
      fieldsColummnExclude={['children']}
      onGlobalDelete={handleDeleteAll}
    />
  );
}

export default PermissionTable;
