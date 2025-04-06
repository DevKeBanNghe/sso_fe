import CTTable from 'components/shared/CTTable';
import { deletePermissions, exportPermissions, getPermissionList, togglePermissionsActive } from '../service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils/toast.util';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import useGetList from 'hooks/useGetList';
import { forwardRef, useImperativeHandle } from 'react';

function PermissionTableRef(props, ref) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: currentPermissionId, currentRootRoute, queryParamsString } = useCurrentPage();

  const {
    data: { totalItems, itemPerPage, list, page },
    queryKey: queryKeyGetPermissionList,
  } = useGetList({ func: getPermissionList });

  useImperativeHandle(ref, () => ({
    queryKey: queryKeyGetPermissionList,
  }));

  const mutationDeletePermissions = useMutation({
    mutationFn: deletePermissions,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(currentPermissionId)) {
        return navigate(`${currentRootRoute}${queryParamsString}`);
      }
      await queryClient.invalidateQueries({
        queryKey: queryKeyGetPermissionList,
      });
    },
  });

  const mutationTogglePermissionsActive = useMutation({
    mutationFn: togglePermissionsActive,
    onSuccess: async ({ errors }) => {
      if (errors) return toast.error(errors);
      toast.success('Update activate status success!');
      await queryClient.invalidateQueries({
        queryKey: queryKeyGetPermissionList,
      });
    },
  });

  const handleTogglePermissionsActive = async ({ ids = [], is_active }) =>
    mutationTogglePermissionsActive.mutate({ permission_ids: ids, is_active });

  const handleDeleteAll = async (ids = []) => mutationDeletePermissions.mutate({ ids });

  const handleExportExcel = async (ids = []) => exportPermissions({ ids });

  return (
    <CTTable
      rowKey={'permission_id'}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      currentPage={page}
      fieldsColummnExclude={['children']}
      onGlobalDelete={handleDeleteAll}
      onGlobalToggleActive={handleTogglePermissionsActive}
      onGlobalExport={handleExportExcel}
    />
  );
}

const PermissionTable = forwardRef(PermissionTableRef);

export default PermissionTable;
