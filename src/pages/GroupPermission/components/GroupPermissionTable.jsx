import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { deleteGroupPermission, getGroupPermissionList } from '../service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import { STALE_TIME_GET_LIST } from 'common/consts/react-query.const';
import CTList from 'components/shared/CTList';
const columns = [
  {
    title: 'Group Permission Name',
    width: 70,
    dataIndex: 'group_permission_name',
    key: 'group_permission_name',
    fixed: 'left',
  },
  {
    title: 'Permissions',
    width: 70,
    dataIndex: 'Permission',
    key: 'Permission',
    render: (value = []) => {
      if (value.length === 0) return <></>;
      return <CTList list={value.map((item) => item.permission_name)} />;
    },
  },
  {
    title: 'Group Permission Description',
    width: 70,
    dataIndex: 'group_permission_description',
    key: 'group_permission_description',
  },
];
function GroupPermissionTable() {
  const navigate = useNavigate();
  const { keyList } = useQueryKeys();
  const queryClient = useQueryClient();
  const {
    id: currentGroupPermissionId,
    currentRootRoute,
    queryParams,
    setQueryParams,
    queryParamsString,
  } = useCurrentPage();

  const mutationDeleteGroupPermission = useMutation({
    mutationFn: deleteGroupPermission,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(parseInt(currentGroupPermissionId))) {
        return navigate(`${currentRootRoute}${queryParamsString}`);
      }
      await queryClient.fetchQuery({
        queryKey: [`${keyList}-${queryParams.page}`],
      });
    },
  });

  const handleDeleteAll = async (ids = []) => {
    mutationDeleteGroupPermission.mutate({ ids });
  };

  const { data: queryGetGroupPermissionListData = {} } = useQuery({
    queryKey: [`${keyList}-${queryParams.page}`],
    queryFn: () => getGroupPermissionList(queryParams),
    staleTime: STALE_TIME_GET_LIST,
  });
  const { data } = queryGetGroupPermissionListData;
  const { totalItems, itemPerPage, list, page } = data ?? {};

  return (
    <CTTable
      rowKey={'group_permission_id'}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      columns={columns}
      onChange={({ current: page }) => {
        setQueryParams((pre) => ({ ...pre, page }));
      }}
      currentPage={page}
      onGlobalDelete={handleDeleteAll}
      onView={({ group_permission_id }) => navigate(`${currentRootRoute}/${group_permission_id}${queryParamsString}`)}
      onEdit={({ group_permission_id }) =>
        navigate(`${currentRootRoute}/edit/${group_permission_id}${queryParamsString}`)
      }
      onDelete={({ group_permission_id }) => handleDeleteAll([group_permission_id])}
      onCopy={({ group_permission_id }) =>
        navigate(`${currentRootRoute}/copy/${group_permission_id}${queryParamsString}`)
      }
    />
  );
}

export default GroupPermissionTable;
