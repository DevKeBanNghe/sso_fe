import { Flex } from 'antd';
import CTIcon from 'components/shared/CTIcon';
import { GoogleCircleFilled, FacebookFilled, GithubFilled } from '@ant-design/icons';
import { redirectTo } from 'common/utils/common.util';
const API_URL = import.meta.env.VITE_API_URL;
const APP_URL = import.meta.env.VITE_APP_URL;

export default function SocialsSignIn() {
  const social_icons = [
    {
      icon: GoogleCircleFilled,
      color: '#de342c',
      onClick: () => {
        redirectTo(`${API_URL}/auth/google?from_url=${APP_URL}`);
      },
    },
    { icon: FacebookFilled, color: '#0866ff' },
    {
      icon: GithubFilled,
      color: '#1f2328',
      onClick: () => {
        redirectTo(`${API_URL}/auth/github?from_url=${APP_URL}`);
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
