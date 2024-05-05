import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { useFormContext } from 'react-hook-form';
import { deleteRoles, getRoleDetail, getRoleList } from '../service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import { STALE_TIME_GET_LIST } from 'common/consts/react-query.const';
import CTTextTruncate from 'components/shared/CTTextTruncate';

function RoleTable() {
  const navigate = useNavigate();
  const { reset, setFocus } = useFormContext();
  const { keyDetail, keyList } = useQueryKeys();
  const queryClient = useQueryClient();
  const { isEdit, isView, id: currentRoleId, currentRootRoute, queryParams, setQueryParams } = useCurrentPage();

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

  const { data: queryGetRoleDetail = {} } = useQuery({
    queryKey: [keyDetail, currentRoleId],
    queryFn: () => getRoleDetail(currentRoleId),
    enabled: currentRoleId ? true : false,
  });
  const { data: dataGetRoleDetail } = queryGetRoleDetail;

  useEffect(() => {
    if (!dataGetRoleDetail) return () => {};
    setFocus('role_name');
    reset(dataGetRoleDetail);
  }, [dataGetRoleDetail]);

  const handleDeleteAll = async (ids = []) => {
    const { errors } = await deleteRoles({ ids });
    if (errors) return toast.error(errors);
    queryClient.fetchQuery({
      queryKey: [`${keyList}-${queryParams.page}`],
    });
    if ((isEdit || isView) && ids.includes(parseInt(currentRoleId))) {
      reset({ role_name: '' });
      navigate(currentRootRoute);
    }
    return toast.success('Delete success');
  };

  const { data: queryGetRoleListData = {} } = useQuery({
    queryKey: [`${keyList}-${queryParams.page}`],
    queryFn: () => getRoleList(queryParams),
    staleTime: STALE_TIME_GET_LIST,
  });
  const { data, errors } = queryGetRoleListData;
  if (errors) toast.error(errors);
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
      onView={({ role_id }) => navigate(`${currentRootRoute}/${role_id}`)}
      onEdit={({ role_id }) => navigate(`${currentRootRoute}/edit/${role_id}`)}
      onCopy={({ role_id }) => navigate(`${currentRootRoute}/copy/${role_id}`)}
      onDelete={({ role_id }) => handleDeleteAll([role_id])}
    />
  );
}

export default RoleTable;
