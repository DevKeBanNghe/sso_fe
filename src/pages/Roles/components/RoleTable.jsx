import CTTable from 'components/shared/CTTable';
import { deleteRoles, getRoleList } from '../service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import useGetList from 'hooks/useGetList';
import { columns } from './RoleColumnTable';

function RoleTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: currentRoleId, currentRootRoute, queryParamsString } = useCurrentPage();

  const {
    data: { totalItems, itemPerPage, list, page },
    queryKey: queryKeyRoleList,
  } = useGetList({ func: getRoleList });

  const mutationDeleteRoles = useMutation({
    mutationFn: deleteRoles,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(parseInt(currentRoleId))) {
        return navigate(`${currentRootRoute}${queryParamsString}`);
      }
      await queryClient.fetchQuery({
        queryKey: [queryKeyRoleList],
      });
    },
  });

  const handleDeleteAll = async (ids = []) => mutationDeleteRoles.mutate({ ids });

  return (
    <CTTable
      rowKey={'role_id'}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      columns={columns}
      currentPage={page}
      onGlobalDelete={handleDeleteAll}
    />
  );
}

export default RoleTable;
