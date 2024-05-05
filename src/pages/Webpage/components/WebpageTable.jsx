import CTTable from 'components/shared/CTTable';
import useQueryKeys from 'hooks/useQueryKeys';
import { useFormContext } from 'react-hook-form';
import { deleteWebpages, getWebpageDetail, getWebpageList } from '../service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'common/utils';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCurrentPage from 'hooks/useCurrentPage';
import { STALE_TIME_GET_LIST } from 'common/consts/react-query.const';
const columns = [
  {
    title: 'Webpage Url',
    width: 70,
    dataIndex: 'webpage_url',
    key: 'webpage_url',
    fixed: 'left',
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
  const { reset, setFocus } = useFormContext();
  const { keyDetail, keyList } = useQueryKeys();
  const queryClient = useQueryClient();
  const { isEdit, isView, id: currentWebpageId, currentRootRoute, queryParams, setQueryParams } = useCurrentPage();

  const { data: queryGetWebpageDetail = {} } = useQuery({
    queryKey: [keyDetail, currentWebpageId],
    queryFn: () => getWebpageDetail(currentWebpageId),
    enabled: currentWebpageId ? true : false,
  });
  const { data: dataGetWebpageDetail } = queryGetWebpageDetail;

  useEffect(() => {
    if (!dataGetWebpageDetail) return () => {};
    setFocus('webpage_url');
    reset(dataGetWebpageDetail);
  }, [dataGetWebpageDetail]);

  const handleDeleteAll = async (ids = []) => {
    const { errors } = await deleteWebpages({ ids });
    if (errors) return toast.error(errors);
    queryClient.fetchQuery({
      queryKey: [`${keyList}-${queryParams.page}`],
    });
    if ((isEdit || isView) && ids.includes(parseInt(currentWebpageId))) {
      reset({ webpage_url: '' });
      navigate(currentRootRoute);
    }
    return toast.success('Delete success');
  };

  const { data: queryGetWebpageListData = {} } = useQuery({
    queryKey: [`${keyList}-${queryParams.page}`],
    queryFn: () => getWebpageList(queryParams),
    staleTime: STALE_TIME_GET_LIST,
  });
  const { data, errors } = queryGetWebpageListData;
  if (errors) toast.error(errors);
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
      onView={({ webpage_id }) => navigate(`${currentRootRoute}/${webpage_id}`)}
      onEdit={({ webpage_id }) => navigate(`${currentRootRoute}/edit/${webpage_id}`)}
      onDelete={({ webpage_id }) => handleDeleteAll([webpage_id])}
      onCopy={({ webpage_id }) => navigate(`${currentRootRoute}/copy/${webpage_id}`)}
    />
  );
}

export default WebpageTable;
