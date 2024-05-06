import { DEFAULT_PAGINATION } from 'common/consts/constants.const';
import { useEffect, useMemo } from 'react';
import { useParams, useResolvedPath, useSearchParams } from 'react-router-dom';

export default function useCurrentPage({ keyIdParams = 'id', isPaging = true } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useResolvedPath();
  const currentRootRouteIndex = pathname.indexOf(import.meta.env.VITE_APP_PREFIX, 1);
  const currentRootRoute = currentRootRouteIndex >= 0 ? pathname.slice(0, currentRootRouteIndex) : pathname;
  const params = useParams();
  const isEdit = pathname.includes('edit');
  const isCopy = pathname.includes('copy');
  const id = params[keyIdParams];
  const isView = !isEdit && !isCopy && id ? true : false;
  const queryParams = useMemo(() => {
    return searchParams.entries().reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }, [searchParams]);

  useEffect(() => {
    if (
      isPaging &&
      (!queryParams.page || !queryParams.itemPerPage || queryParams.page < 1 || queryParams.itemPerPage < 1)
    ) {
      setSearchParams(DEFAULT_PAGINATION);
    }
  }, []);

  const setQueryParams = (value) => {
    if (typeof value === 'function') {
      return setSearchParams(value(queryParams));
    }
    setSearchParams(value);
  };

  return {
    isEdit,
    isView,
    isCreate: !isEdit && !isView,
    isCopy,
    id,
    currentRootRoute,
    currentRoute: pathname,
    params,
    queryParams,
    setQueryParams,
  };
}
