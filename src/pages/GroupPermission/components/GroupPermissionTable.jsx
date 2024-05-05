import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { useFormContext } from 'react-hook-form';
import { deleteGroupPermission, getGroupPermissionDetail, getGroupPermissionList } from '../service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils';
import { useEffect } from 'react';
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
  const { reset, setFocus } = useFormContext();
  const { keyDetail, keyList } = useQueryKeys();
  const queryClient = useQueryClient();
  const {
    isEdit,
    isView,
    id: currentGroupPermissionId,
    currentRootRoute,
    queryParams,
    setQueryParams,
  } = useCurrentPage();

  const { data: queryGetGroupPermissionDetail = {} } = useQuery({
    queryKey: [keyDetail, currentGroupPermissionId],
    queryFn: () => getGroupPermissionDetail(currentGroupPermissionId),
    enabled: currentGroupPermissionId ? true : false,
  });
  const { data: dataGetGroupPermissionDetail } = queryGetGroupPermissionDetail;

  useEffect(() => {
    if (!dataGetGroupPermissionDetail) return () => {};
    setFocus('group_permission_name');
    reset(dataGetGroupPermissionDetail);
  }, [dataGetGroupPermissionDetail]);

  const handleDeleteAll = async (ids = []) => {
    const { errors } = await deleteGroupPermission({ ids });
    if (errors) return toast.error(errors);
    queryClient.fetchQuery({
      queryKey: [`${keyList}-${queryParams.page}`],
    });
    if ((isEdit || isView) && ids.includes(parseInt(currentGroupPermissionId))) {
      reset({ group_permission_name: '' });
      navigate(currentRootRoute);
    }
    return toast.success('Delete success');
  };

  const { data: queryGetGroupPermissionListData = {} } = useQuery({
    queryKey: [`${keyList}-${queryParams.page}`],
    queryFn: () => getGroupPermissionList(queryParams),
    staleTime: STALE_TIME_GET_LIST,
  });
  const { data, errors } = queryGetGroupPermissionListData;
  if (errors) toast.error(errors);
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
      onView={({ group_permission_id }) => navigate(`${currentRootRoute}/${group_permission_id}`)}
      onEdit={({ group_permission_id }) => navigate(`${currentRootRoute}/edit/${group_permission_id}`)}
      onDelete={({ group_permission_id }) => handleDeleteAll([group_permission_id])}
      onCopy={({ group_permission_id }) => navigate(`${currentRootRoute}/copy/${group_permission_id}`)}
    />
  );
}

export default GroupPermissionTable;
