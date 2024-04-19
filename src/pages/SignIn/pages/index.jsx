import { Input, Button, Checkbox, Divider, Row, Col, Flex, Image, Form } from 'antd';
import { UserOutlined, LockOutlined, GoogleCircleFilled, FacebookFilled, GithubFilled } from '@ant-design/icons';
import { Typography } from 'antd';

const { Link } = Typography;
import Logo from 'images/logo.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CTForm from 'components/shared/CTForm';
import CTIcon from 'components/shared/CTIcon';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllUser, signIn } from '../service';
import { useEffect } from 'react';
import { toast } from 'common/utils';

export default function SignIn() {
  const social_icons = [
    { icon: GoogleCircleFilled, color: '#de342c' },
    { icon: FacebookFilled, color: '#0866ff' },
    { icon: GithubFilled, color: '#1f2328' },
  ];
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm();

  // const query = useQuery({ queryKey: ['sign-in'], queryFn: getTodos })

  useEffect(() => {
    getAllUser().then((data) => {
      console.log('🚀 ~ getAllUser ~ data:', data);
    });
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await signIn(data);
      console.log('🚀 ~ onSubmit ~ res:', res);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic
  };

  const handleFacebookLogin = () => {
    // Handle Facebook login logic
  };

  const handleForgotPassword = () => {
    // Handle Facebook login logic
  };

  const handleRegister = () => {
    // Handle Facebook login logic
  };

  const items = [
    {
      render: () => (
        <Flex gap='middle' justify='center'>
          <Image style={{ cursor: 'pointer' }} onClick={() => navigate('/')} preview={false} width={200} src={Logo} />
        </Flex>
      ),
    },
    {
      field: 'user_name',
      render: ({ field }) => {
        return (
          <Form.Item name='user_name' rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input {...field} size='large' prefix={<UserOutlined />} placeholder='Username, Email or Password' />
          </Form.Item>
        );
      },
    },
    {
      field: 'password',
      render: ({ field }) => {
        return (
          <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password {...field} size='large' prefix={<LockOutlined />} placeholder='Password' />
          </Form.Item>
        );
      },
    },
    {
      render: () => (
        <Form.Item>
          <Form.Item name='remember' valuePropName='checked' noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Link style={{ float: 'right' }} onClick={handleForgotPassword}>
            Forgot password
          </Link>
        </Form.Item>
      ),
    },
    {
      render: () => (
        <Form.Item>
          <Button size='large' type='primary' htmlType='submit' className='login-form-button' style={{ width: '100%' }}>
            Login
          </Button>
        </Form.Item>
      ),
    },
    {
      render: () => (
        <Form.Item>
          <Flex gap='middle' justify='center'>
            <Link onClick={() => navigate('/sign-up')}>Register now !</Link>
          </Flex>
        </Form.Item>
      ),
    },
    {
      render: () => (
        <>
          <Divider plain>Or</Divider>
          <Flex gap='middle' justify='center'>
            {social_icons.map((item, index) => (
              <CTIcon key={`social_icon_${index}`} icon={item.icon} color={item.color} />
            ))}
          </Flex>
        </>
      ),
    },
  ];

  return (
    <Row justify='center'>
      <Col span={8}>
        <CTForm name='login-form' items={items} global_control={control} onSubmit={handleSubmit(onSubmit)} />
      </Col>
    </Row>
  );
}
