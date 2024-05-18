import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { deleteWebpages, getWebpageList } from '../service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import { STALE_TIME_GET_LIST } from 'common/consts/react-query.const';
import CTList from 'components/shared/CTList';
const columns = [
  {
    title: 'Webpage Url',
    width: 70,
    dataIndex: 'webpage_url',
    key: 'webpage_url',
    fixed: 'left',
  },
  {
    title: 'Group Role',
    width: 70,
    dataIndex: 'GroupRole',
    key: 'GroupRole',
    render: (value = []) => {
      if (value.length === 0) return <></>;
      return <CTList list={value.map((item) => item.group_role_name)} />;
    },
  },
  {
    title: 'Webpage Description',
    width: 70,
    dataIndex: 'webpage_description',
    key: 'webpage_description',
  },
];
function WebpageTable() {
  const navigate = useNavigate();
  const { keyList } = useQueryKeys();
  const queryClient = useQueryClient();
  const { id: currentWebpageId, currentRootRoute, queryParams, setQueryParams, queryParamsString } = useCurrentPage();

  const mutationDeleteWebpages = useMutation({
    mutationFn: deleteWebpages,
    onSuccess: async ({ errors }, { ids }) => {
      if (errors) return toast.error(errors);
      toast.success('Delete success');
      if (ids.includes(parseInt(currentWebpageId))) {
        return navigate(`${currentRootRoute}${queryParamsString}`);
      }
      await queryClient.fetchQuery({
        queryKey: [`${keyList}-${queryParams.page}`],
      });
    },
  });

  const handleDeleteAll = async (ids = []) => {
    mutationDeleteWebpages.mutate({ ids });
  };

  const { data: queryGetWebpageListData = {} } = useQuery({
    queryKey: [`${keyList}-${queryParams.page}`],
    queryFn: () => getWebpageList(queryParams),
    staleTime: STALE_TIME_GET_LIST,
  });
  const { data } = queryGetWebpageListData;
  const { totalItems, itemPerPage, list, page } = data ?? {};
  return (
    <CTTable
      rowKey={'webpage_id'}
      totalItems={totalItems}
      itemPerPage={itemPerPage}
      rows={list}
      columns={columns}
      onChange={({ current: page }) => {
        setQueryParams((pre) => ({ ...pre, page }));
      }}
      currentPage={page}
      onGlobalDelete={handleDeleteAll}
      onView={({ webpage_id }) => navigate(`${currentRootRoute}/${webpage_id}${queryParamsString}`)}
      onEdit={({ webpage_id }) => navigate(`${currentRootRoute}/edit/${webpage_id}${queryParamsString}`)}
      onDelete={({ webpage_id }) => handleDeleteAll([webpage_id])}
      onCopy={({ webpage_id }) => navigate(`${currentRootRoute}/copy/${webpage_id}${queryParamsString}`)}
    />
  );
}

export default WebpageTable;
