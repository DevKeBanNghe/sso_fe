import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { useFormContext } from 'react-hook-form';
import { deletePermissions, getPermissionDetail, getPermissionList } from '../service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils';
import { useEffect } from 'react';
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
  const { reset, setFocus } = useFormContext();
  const { keyDetail, keyList } = useQueryKeys();
  const queryClient = useQueryClient();
  const { isEdit, isView, id: currentPermissionId, currentRootRoute, queryParams, setQueryParams } = useCurrentPage();

  const { data: queryGetPermissionDetail = {} } = useQuery({
    queryKey: [keyDetail, currentPermissionId],
    queryFn: () => getPermissionDetail(currentPermissionId),
    enabled: currentPermissionId ? true : false,
  });
  const { data: dataGetPermissionDetail } = queryGetPermissionDetail;

  useEffect(() => {
    if (!dataGetPermissionDetail) return () => {};
    setFocus('permission_name');
    reset(dataGetPermissionDetail);
  }, [dataGetPermissionDetail]);

  const handleDeleteAll = async (ids = []) => {
    const { errors } = await deletePermissions({ ids });
    if (errors) return toast.error(errors);
    queryClient.fetchQuery({
      queryKey: [`${keyList}-${queryParams.page}`],
    });
    if ((isEdit || isView) && ids.includes(parseInt(currentPermissionId))) {
      reset({ permission_name: '' });
      navigate(currentRootRoute);
    }
    return toast.success('Delete success');
  };

  const { data: queryGetPermissionListData = {} } = useQuery({
    queryKey: [`${keyList}-${queryParams.page}`],
    queryFn: () => getPermissionList(queryParams),
    staleTime: STALE_TIME_GET_LIST,
  });
  const { data, errors } = queryGetPermissionListData;
  if (errors) toast.error(errors);
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
      onView={({ permission_id }) => navigate(`${currentRootRoute}/${permission_id}`)}
      onEdit={({ permission_id }) => navigate(`${currentRootRoute}/edit/${permission_id}`)}
      onDelete={({ permission_id }) => handleDeleteAll([permission_id])}
      onCopy={({ permission_id }) => navigate(`${currentRootRoute}/copy/${permission_id}`)}
    />
  );
}

export default PermissionTable;
