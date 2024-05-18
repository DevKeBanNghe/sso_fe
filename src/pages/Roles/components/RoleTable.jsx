import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { deleteRoles, getRoleList } from '../service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import { STALE_TIME_GET_LIST } from 'common/consts/react-query.const';
import CTTextTruncate from 'components/shared/CTTextTruncate';

function RoleTable() {
  const navigate = useNavigate();
  const { keyList } = useQueryKeys();
  const queryClient = useQueryClient();
  const { id: currentRoleId, currentRootRoute, queryParams, setQueryParams, queryParamsString } = useCurrentPage();

  const columns = [
    {
      title: 'Role Name',
      width: 50,
      dataIndex: 'role_name',
      key: 'role_name',
      fixed: 'left',
    },
    {
      title: 'Group Role',
      width: 50,
      dataIndex: 'GroupRole',
      key: 'GroupRole',
      render: (value) => value.group_role_name,
    },
    {
      title: 'Role Description',
      width: 50,
      dataIndex: 'role_description',
      key: 'role_description',
      render: (value) => {
        return <CTTextTruncate>{value}</CTTextTruncate>;
      },
    },
  ];

  const mutationDeleteRoles = useMutation({
    mutationFn: deleteRoles,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(parseInt(currentRoleId))) {
        return navigate(`${currentRootRoute}${queryParamsString}`);
      }
      await queryClient.fetchQuery({
        queryKey: [`${keyList}-${queryParams.page}`],
      });
    },
  });

  const handleDeleteAll = async (ids = []) => {
    mutationDeleteRoles.mutate({ ids });
  };

  const { data: queryGetRoleListData = {} } = useQuery({
    queryKey: [`${keyList}-${queryParams.page}`],
    queryFn: () => getRoleList(queryParams),
    staleTime: STALE_TIME_GET_LIST,
  });
  const { data } = queryGetRoleListData;
  const { totalItems, itemPerPage, list, page } = data ?? {};

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
      onView={({ role_id }) => navigate(`${currentRootRoute}/${role_id}${queryParamsString}`)}
      onEdit={({ role_id }) => navigate(`${currentRootRoute}/edit/${role_id}${queryParamsString}`)}
      onCopy={({ role_id }) => navigate(`${currentRootRoute}/copy/${role_id}${queryParamsString}`)}
      onDelete={({ role_id }) => handleDeleteAll([role_id])}
    />
  );
}

export default RoleTable;
