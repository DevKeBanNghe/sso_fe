import { useNavigate } from 'react-router-dom';
import useCurrentPage from './useCurrentPage';
const APP_PREFIX = import.meta.env.VITE_APP_PREFIX ?? '/';
export default function usePageRedirect() {
  const navigate = useNavigate();
  const { queryParamsString } = useCurrentPage({ isPaging: false });

  return {
    goToHomePage: () => navigate(`${APP_PREFIX}${queryParamsString}`),
    navigate: (link = APP_PREFIX, options) => navigate(`${link}${queryParamsString}`, options),
  };
}
