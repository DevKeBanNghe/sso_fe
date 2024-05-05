import { useResolvedPath } from 'react-router-dom';
export default function useQueryKeys() {
  const { pathname } = useResolvedPath();
  return {
    keyList: `${pathname}-list`,
    keyDetail: `${pathname}-detail`,
    keyUpdate: `${pathname}-update`,
    keyDelete: `${pathname}-delete`,
  };
}
