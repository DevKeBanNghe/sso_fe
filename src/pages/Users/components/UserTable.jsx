import CTTable from 'components/shared/CTTable';
import { deleteUsers, getUserList } from '../service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import useGetList from 'hooks/useGetList';
import { columns } from './UserColumnTable';

function UserTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: currentUserId, currentRootRoute, queryParamsString } = useCurrentPage();

  const {
    data: { totalItems, itemPerPage, list, page },
    queryKey: queryKeyGetUserList,
  } = useGetList({ func: getUserList });

  const mutationDeleteUsers = useMutation({
    mutationFn: deleteUsers,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(parseInt(currentUserId))) {
        return navigate(`${currentRootRoute}${queryParamsString}`);
      }
      await queryClient.fetchQuery({
        queryKey: [queryKeyGetUserList],
      });
    },
  });

  const handleDeleteAll = async (ids = []) => mutationDeleteUsers.mutate({ ids });

  return (
    <CTTable
      rowKey={'user_id'}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      columns={columns}
      currentPage={page}
      onGlobalDelete={handleDeleteAll}
    />
  );
}

export default UserTable;
