import { Breadcrumb as BreadcrumbAntd } from 'antd';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { routers } from 'routers';
import { genRouteNameDefault } from 'common/utils/route.util';

const Breadcrumb = ({ separator = '>' } = {}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const breadcrumbs = useMemo(() => {
    const breadcrumbs = [];
    for (const route of routers) {
      if (!(pathname.includes(route.path) && ((route.is_breadcrumb ?? true) ? true : route.is_breadcrumb))) continue;
      breadcrumbs.push({
        title: route.name ?? genRouteNameDefault(route.path),
        href: '',
        onClick: (e) => {
          e.preventDefault();
          navigate(route.path);
        },
      });
    }
    return breadcrumbs;
  }, [pathname, navigate]);
  return (
    <BreadcrumbAntd
      separator={separator}
      items={[
        {
          title: <HomeOutlined />,
          href: '',
          onClick: (e) => {
            e.preventDefault();
            navigate('/');
          },
        },
        ...breadcrumbs,
      ]}
    />
  );
};

export default Breadcrumb;
