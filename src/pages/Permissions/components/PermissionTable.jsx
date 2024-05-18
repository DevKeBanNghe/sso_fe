import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { deletePermissions, getPermissionList } from '../service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import { STALE_TIME_GET_LIST } from 'common/consts/react-query.const';
const columns = [
  {
    title: 'Permission Name',
    width: 70,
    dataIndex: 'permission_name',
    key: 'permission_name',
    fixed: 'left',
  },
  {
    title: 'Permission Key',
    width: 70,
    dataIndex: 'permission_key',
    key: 'permission_key',
  },
  {
    title: 'Permission Router',
    width: 70,
    dataIndex: 'permission_router',
    key: 'permission_router',
  },
  {
    title: 'Group Permision',
    width: 70,
    dataIndex: 'GroupPermission',
    key: 'GroupPermission',
    render: (value) => value.group_permission_name,
  },
  {
    title: 'Permission Description',
    width: 70,
    dataIndex: 'permission_description',
    key: 'permission_description',
  },
];
function PermissionTable() {
  const navigate = useNavigate();
  const { keyList } = useQueryKeys();
  const queryClient = useQueryClient();
  const {
    id: currentPermissionId,
    currentRootRoute,
    queryParams,
    setQueryParams,
    queryParamsString,
  } = useCurrentPage();

  const mutationDeletePermissions = useMutation({
    mutationFn: deletePermissions,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(parseInt(currentPermissionId))) {
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

  const { data: queryGetPermissionListData = {} } = useQuery({
    queryKey: [`${keyList}-${queryParams.page}`],
    queryFn: () => getPermissionList(queryParams),
    staleTime: STALE_TIME_GET_LIST,
  });
  const { data } = queryGetPermissionListData;
  const { totalItems, itemPerPage, list, page } = data ?? {};

  return (
    <CTTable
      rowKey={'permission_id'}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      columns={columns}
      onChange={({ current: page }) => {
        setQueryParams((prev) => ({ ...prev, page }));
      }}
      currentPage={page}
      onGlobalDelete={handleDeleteAll}
      onView={({ permission_id }) => navigate(`${currentRootRoute}/${permission_id}${queryParamsString}`)}
      onEdit={({ permission_id }) => navigate(`${currentRootRoute}/edit/${permission_id}${queryParamsString}`)}
      onDelete={({ permission_id }) => handleDeleteAll([permission_id])}
      onCopy={({ permission_id }) => navigate(`${currentRootRoute}/copy/${permission_id}${queryParamsString}`)}
    />
  );
}

export default PermissionTable;
