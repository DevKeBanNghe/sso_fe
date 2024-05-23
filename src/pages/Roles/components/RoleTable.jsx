import CTTable from 'components/shared/CTTable';
import { deleteRoles } from '../service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import CTTextTruncate from 'components/shared/CTTextTruncate';
import useRoleList from '../hooks/useRoleList';

const columns = [
  {
    title: 'Role Name',
    width: 50,
    dataIndex: 'role_name',
    key: 'role_name',
    fixed: 'left',
  },
  {
    title: 'Role Description',
    width: 50,
    dataIndex: 'role_description',
    key: 'role_description',
    render: (value) => <CTTextTruncate>{value}</CTTextTruncate>,
  },
];

function RoleTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: currentRoleId, currentRootRoute, setQueryParams, queryParamsString } = useCurrentPage();

  const {
    data: { totalItems, itemPerPage, list, page },
    queryKeyRoleList,
  } = useRoleList();

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

  const handleDeleteAll = async (ids = []) => {
    mutationDeleteRoles.mutate({ ids });
  };

  return (
    <CTTable
      rowKey={'role_id'}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      columns={columns}
      onChange={({ current: page }) => {
        setQueryParams((prev) => ({ ...prev, page }));
      }}
      currentPage={page}
      onGlobalDelete={handleDeleteAll}
    />
  );
}

export default RoleTable;
