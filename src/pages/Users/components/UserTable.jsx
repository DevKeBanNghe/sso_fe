import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { deleteUsers, getUserList } from '../service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import { STALE_TIME_GET_LIST } from 'common/consts/react-query.const';
import CTTextTruncate from 'components/shared/CTTextTruncate';

function UserTable() {
  const navigate = useNavigate();
  const { keyList } = useQueryKeys();
  const queryClient = useQueryClient();
  const { id: currentUserId, currentRootRoute, queryParams, setQueryParams, queryParamsString } = useCurrentPage();

  const columns = [
    {
      title: 'User Name',
      width: 50,
      dataIndex: 'user_name',
      key: 'user_name',
      fixed: 'left',
    },
    // {
    //   title: 'Role',
    //   width: 50,
    //   dataIndex: 'Role',
    //   key: 'Role',
    //   render: (value) => value.role_name,
    // },
    {
      title: 'User Description',
      width: 50,
      dataIndex: 'user_description',
      key: 'user_description',
      render: (value) => {
        return <CTTextTruncate>{value}</CTTextTruncate>;
      },
    },
  ];

  const mutationDeleteUsers = useMutation({
    mutationFn: deleteUsers,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(parseInt(currentUserId))) {
        return navigate(`${currentRootRoute}${queryParamsString}`);
      }
      await queryClient.fetchQuery({
        queryKey: [`${keyList}-${queryParams.page}`],
      });
    },
  });

  const handleDeleteAll = async (ids = []) => {
    mutationDeleteUsers.mutate({ ids });
  };

  const { data: queryGetUserListData = {} } = useQuery({
    queryKey: [`${keyList}-${queryParams.page}`],
    queryFn: () => getUserList(queryParams),
    staleTime: STALE_TIME_GET_LIST,
  });
  const { data } = queryGetUserListData;
  const { totalItems, itemPerPage, list, page } = data ?? {};

  return (
    <CTTable
      rowKey={'user_id'}
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

export default UserTable;
