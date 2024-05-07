import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { deleteGroupRole, getGroupRoleList } from '../service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import { STALE_TIME_GET_LIST } from 'common/consts/react-query.const';
import CTList from 'components/shared/CTList';
const columns = [
  {
    title: 'GroupRole Name',
    width: 70,
    dataIndex: 'group_role_name',
    key: 'group_role_name',
    fixed: 'left',
  },
  {
    title: 'Role',
    width: 70,
    dataIndex: 'Role',
    key: 'Role',
    render: (value = []) => {
      if (value.length === 0) return <></>;
      return <CTList list={value.map((item) => item.role_name)} />;
    },
  },
  {
    title: 'Group Permision',
    width: 70,
    dataIndex: 'GroupPermission',
    key: 'GroupPermission',
    render: (value = []) => {
      if (value.length === 0) return <></>;
      return <CTList list={value.map((item) => item.group_permission_name)} />;
    },
  },
  {
    title: 'GroupRole Description',
    width: 70,
    dataIndex: 'group_role_description',
    key: 'group_role_description',
  },
];
function GroupRoleTable() {
  const navigate = useNavigate();
  const { keyList } = useQueryKeys();
  const queryClient = useQueryClient();
  const { id: currentGroupRoleId, currentRootRoute, queryParams, setQueryParams, queryParamsString } = useCurrentPage();

  const mutationDeleteGroupRole = useMutation({
    mutationFn: deleteGroupRole,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(parseInt(currentGroupRoleId))) {
        return navigate(`${currentRootRoute}${queryParamsString}`);
      }
      await queryClient.fetchQuery({
        queryKey: [`${keyList}-${queryParams.page}`],
      });
    },
  });

  const handleDeleteAll = async (ids = []) => {
    mutationDeleteGroupRole.mutate({ ids });
  };

  const { data: queryGetGroupRoleListData = {} } = useQuery({
    queryKey: [`${keyList}-${queryParams.page}`],
    queryFn: () => getGroupRoleList(queryParams),
    staleTime: STALE_TIME_GET_LIST,
  });
  const { data, errors } = queryGetGroupRoleListData;
  if (errors) toast.error(errors);
  const { totalItems, itemPerPage, list, page } = data ?? {};
  return (
    <CTTable
      rowKey={'group_role_id'}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      columns={columns}
      onChange={({ current: page }) => {
        setQueryParams((prev) => ({ ...prev, page }));
      }}
      currentPage={page}
      onGlobalDelete={handleDeleteAll}
      onView={({ group_role_id }) => navigate(`${currentRootRoute}/${group_role_id}${queryParamsString}`)}
      onEdit={({ group_role_id }) => navigate(`${currentRootRoute}/edit/${group_role_id}${queryParamsString}`)}
      onDelete={({ group_role_id }) => handleDeleteAll([group_role_id])}
      onCopy={({ group_role_id }) => navigate(`${currentRootRoute}/copy/${group_role_id}${queryParamsString}`)}
    />
  );
}

export default GroupRoleTable;
