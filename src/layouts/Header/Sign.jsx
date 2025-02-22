import { Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Link } = Typography;

export default function Sign() {
  const navigate = useNavigate();
  return (
    <Flex gap={'middle'}>
      <Link style={{ color: 'black', opacity: '0.7' }} onClick={() => navigate('/sign-in')}>
        Sign in
      </Link>
      <Link style={{ color: 'black' }} onClick={() => navigate('/sign-up')}>
        Sign up
      </Link>
    </Flex>
  );
}
