import CTTable from 'components/shared/CTTable';
import { deleteRoles, getRoleList, toggleRolesActive } from '../service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils/toast.util';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import useGetList from 'hooks/useGetList';
import { PERMISSION_KEYS } from '../const';

function RoleTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: currentRoleId, currentRootRoute, queryParamsString } = useCurrentPage();

  const { data, queryKey: queryKeyRoleList } = useGetList({ func: getRoleList });
  const { totalItems, itemPerPage, list, page } = data ?? {};

  const mutationDeleteRoles = useMutation({
    mutationFn: deleteRoles,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(currentRoleId)) {
        return navigate(`${currentRootRoute}${queryParamsString}`);
      }
      await queryClient.fetchQuery({
        queryKey: [queryKeyRoleList],
      });
    },
  });

  const mutationToggleRolesActive = useMutation({
    mutationFn: toggleRolesActive,
    onSuccess: async ({ errors }) => {
      if (errors) return toast.error(errors);
      toast.success('Update activate status success!');
      await queryClient.fetchQuery({
        queryKey: [queryKeyRoleList],
      });
    },
  });

  const handleDeleteAll = async (ids = []) => mutationDeleteRoles.mutate({ ids });
  const handleToggleRolesActive = async ({ ids = [], is_active }) =>
    mutationToggleRolesActive.mutate({ role_ids: ids, is_active });

  return (
    <CTTable
      rowKey={'role_id'}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      currentPage={page}
      onGlobalDelete={handleDeleteAll}
      onGlobalToggleActive={handleToggleRolesActive}
      fieldsColummnExclude={['children']}
      permission_keys={[PERMISSION_KEYS.VIEW_ROLE_PERMISSION]}
      actions={[
        {
          type: 'active',
          permission_keys: PERMISSION_KEYS.ACTIVE_ROLE_PERMISSION,
        },
        {
          type: 'copy',
          permission_keys: PERMISSION_KEYS.CREATE_ROLE_PERMISSION,
        },
        {
          type: 'delete',
          permission_keys: PERMISSION_KEYS.DELETE_ROLE_PERMISSION,
        },
        {
          type: 'view',
          permission_keys: PERMISSION_KEYS.VIEW_ROLE_PERMISSION,
        },
        {
          type: 'edit',
          permission_keys: PERMISSION_KEYS.UPDATE_ROLE_PERMISSION,
        },
      ]}
    />
  );
}

export default RoleTable;
