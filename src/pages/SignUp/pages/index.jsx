import { Input, Button, Divider, Row, Col, Flex, Image, Form, DatePicker } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  GoogleCircleFilled,
  FacebookFilled,
  GithubFilled,
  MailOutlined,
} from '@ant-design/icons';
import { Typography } from 'antd';

const { Link } = Typography;
import Logo from 'images/logo.png';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import CTForm from 'components/shared/CTForm';
import CTIcon from 'components/shared/CTIcon';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllUser, signUp } from '../service';
import { useEffect } from 'react';
import { antdDateToStringDate, toast } from 'common/utils';
import PhoneNumberInput from 'components/shared/PhoneNumberInput';
import { redirectTo } from 'common/utils/common.util';
const API_URL = import.meta.env.VITE_API_URL;
const APP_URL = import.meta.env.VITE_APP_URL;

export default function SignUp() {
  const navigate = useNavigate();
  const social_icons = [
    {
      icon: GoogleCircleFilled,
      color: '#de342c',
      onClick: () => {
        redirectTo(`${API_URL}/auth/google?from_url=${APP_URL}`);
      },
    },
    { icon: FacebookFilled, color: '#0866ff' },
    { icon: GithubFilled, color: '#1f2328' },
  ];
  const {
    formState: { errors },
    control,
    handleSubmit,
    watch,
  } = useForm();

  // const query = useQuery({ queryKey: ['sign-in'], queryFn: getTodos })

  useEffect(() => {
    getAllUser().then((data) => {
      console.log('🚀 ~ getAllUser ~ data:', data);
    });
  }, []);

  const onSubmit = async (data) => {
    data.date_of_birth = antdDateToStringDate({ value: data.date_of_birth });
    try {
      const res = await signUp(data);
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
      field: 'email',
      render: ({ field }) => {
        return (
          <Form.Item
            name='email'
            rules={[
              { required: true, message: 'Please input your email!' },
              {
                type: 'email',
                message: 'The input is not valid email!',
              },
            ]}>
            <Input {...field} size='large' prefix={<MailOutlined />} placeholder='Email' />
          </Form.Item>
        );
      },
    },
    {
      field: 'date_of_birth',
      render: ({ field }) => {
        return (
          <Flex justify='space-between' gap={'15px'}>
            <Controller
              name='phone_number'
              control={control}
              render={({ field }) => {
                return (
                  <Form.Item>
                    <PhoneNumberInput {...field} />
                  </Form.Item>
                );
              }}
            />
            <Form.Item label={'Date of birth'}>
              <DatePicker size='large' format={'DD/MM/YYYY'} {...field} />
            </Form.Item>
          </Flex>
        );
      },
    },
    {
      field: 'user_name',
      render: ({ field }) => {
        return (
          <Form.Item name='user_name' rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input {...field} size='large' prefix={<UserOutlined />} placeholder='Username' />
          </Form.Item>
        );
      },
    },
    {
      field: 'password',
      render: ({ field }) => {
        return (
          <Form.Item
            name='password'
            rules={[
              { required: true, message: 'Please input your password!' },
              // {
              //   pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              //   message:
              //     'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character',
              // },
            ]}>
            <Input.Password {...field} size='large' prefix={<LockOutlined />} placeholder='Password' />
          </Form.Item>
        );
      },
    },
    {
      field: 'confirm_password',
      render: ({ field }) => {
        return (
          <Form.Item
            name='confirm_password'
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please input your confirm password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Confirm password not match!'));
                },
              }),
            ]}>
            <Input.Password
              disabled={!watch('password')}
              {...field}
              size='large'
              prefix={<LockOutlined />}
              placeholder='Confirm Password'
            />
            {errors && errors.confirm_password?.message}
          </Form.Item>
        );
      },
    },
    {
      render: () => (
        <Form.Item>
          <Button size='large' type='primary' htmlType='submit' className='login-form-button' style={{ width: '100%' }}>
            Sign Up
          </Button>
        </Form.Item>
      ),
    },
    {
      render: () => (
        <Form.Item>
          <Flex gap='middle' justify='center'>
            <Link onClick={() => navigate('/sign-in')}>Sign In now !</Link>
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
              <CTIcon key={`social_icon_${index}`} {...item} />
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
