import { Flex, Typography } from 'antd';
import CTAvartar from 'components/shared/CTAvartar';
import CTDropdown from 'components/shared/CTDropdown';
import { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { logout } from 'pages/SignIn/service';
import { toast } from 'common/utils/toast.util';
import { useNavigate } from 'react-router-dom';
const { Link } = Typography;

export default function Events() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    toast.success('Logout successfully');
    navigate('/sign-in');
  };

  const [userInfo] = useState([
    {
      label: <Link>Profile</Link>,
      key: '0',
    },
    {
      label: <Link>Settings</Link>,
      key: '1',
    },
    {
      label: <Link onClick={handleLogout}>Logout</Link>,
      key: '2',
    },
  ]);
  // const [notifications] = useState([
  //   {
  //     label: <a href='https://www.antgroup.com'>1st menu item</a>,
  //     key: '0',
  //   },
  //   {
  //     type: 'divider',
  //   },
  //   {
  //     label: '2rd menu item',
  //     key: '1',
  //   },
  // ]);

  // const notificationLength = useMemo(() => notifications.filter((noti) => noti.key).length, [notifications]);
  return (
    <Flex gap={'middle'}>
      {/* <CTDropdown items={notifications} placement='topRight' arrow>
        <a onClick={(e) => e.preventDefault()}>
          <CTAvartar badgetValue={notificationLength} icon={<BellOutlined />} />
        </a>
      </CTDropdown> */}

      <CTDropdown items={userInfo} placement='topRight' arrow>
        <a onClick={(e) => e.preventDefault()}>
          <CTAvartar badgetValue={0} icon={<UserOutlined />} />
        </a>
      </CTDropdown>
    </Flex>
  );
}
