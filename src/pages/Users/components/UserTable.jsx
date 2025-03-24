import CTTable from 'components/shared/CTTable';
import { deleteUsers, exportUsers, getUserList, toggleUsersActive } from '../service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils/toast.util';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import useGetList from 'hooks/useGetList';
import { columns } from './UserColumnTable';
import { forwardRef, useImperativeHandle } from 'react';

function UserTableRef(props, ref) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: currentUserId, currentRootRoute, queryParamsString } = useCurrentPage();

  const {
    data: { totalItems, itemPerPage, list, page },
    queryKey: queryKeyGetUserList,
  } = useGetList({ func: getUserList });

  useImperativeHandle(ref, () => ({
    queryKey: queryKeyGetUserList,
  }));

  const mutationDeleteUsers = useMutation({
    mutationFn: deleteUsers,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(currentUserId)) {
        return navigate(`${currentRootRoute}${queryParamsString}`);
      }
      await queryClient.invalidateQueries({
        queryKey: queryKeyGetUserList,
      });
    },
  });

  const mutationToggleUsersActive = useMutation({
    mutationFn: toggleUsersActive,
    onSuccess: async ({ errors }) => {
      if (errors) return toast.error(errors);
      toast.success('Update activate status success!');
      await queryClient.invalidateQueries({
        queryKey: queryKeyGetUserList,
      });
    },
  });

  const handleToggleUsersActive = async ({ ids = [], is_active }) =>
    mutationToggleUsersActive.mutate({ user_ids: ids, is_active });

  const handleDeleteAll = async (ids = []) => mutationDeleteUsers.mutate({ ids });

  const handleExportExcel = async (ids = []) => exportUsers({ ids });

  return (
    <CTTable
      rowKey={'user_id'}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      columns={columns}
      currentPage={page}
      onGlobalDelete={handleDeleteAll}
      onGlobalExport={handleExportExcel}
      onGlobalToggleActive={handleToggleUsersActive}
    />
  );
}

const UserTable = forwardRef(UserTableRef);

export default UserTable;
