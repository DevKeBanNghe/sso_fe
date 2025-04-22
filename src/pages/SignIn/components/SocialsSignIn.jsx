import { Flex } from 'antd';
import CTIcon from 'components/shared/CTIcon';
import { GoogleCircleFilled, GithubFilled } from '@ant-design/icons';
import { redirectTo } from 'common/utils/common.util';
import useCurrentPage from 'hooks/useCurrentPage';
const API_URL = import.meta.env.VITE_API_URL;

export default function SocialsSignIn() {
  const { queryParams } = useCurrentPage({ isPaging: false });
  const webpage_key = queryParams.webpage_key;
  const social_icons = [
    {
      icon: GoogleCircleFilled,
      color: '#de342c',
      onClick: () => {
        redirectTo(`${API_URL}/auth/google?webpage_key=${webpage_key}`);
      },
    },
    // {
    //   icon: FacebookFilled,
    //   color: '#0866ff',
    //   onClick: () => {
    //     redirectTo(`${API_URL}/auth/facebook?webpage_key=${webpage_key}`);
    //   },
    // },
    {
      icon: GithubFilled,
      color: '#1f2328',
      onClick: () => {
        redirectTo(`${API_URL}/auth/github?webpage_key=${webpage_key}`);
      },
    },
  ];
  return (
    <Flex gap='middle' justify='center'>
      {social_icons.map((item, index) => (
        <CTIcon style={{ fontSize: '40px' }} key={`social_icon_${index}`} {...item} />
      ))}
    </Flex>
  );
}
