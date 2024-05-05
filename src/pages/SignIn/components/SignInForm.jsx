import { Button, Divider, Flex, Form, Image, Input } from 'antd';
import CTForm from 'components/shared/CTForm';
import { useFormContext } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Logo from 'images/logo.png';
import useLocalStorage from 'hooks/useLocalStorage';
import { CODE_RESET_KEY } from 'common/consts';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import SocialsSignIn from './SocialsSignIn';
import { useState } from 'react';
import { forgotPassword, signIn } from '../service';
import { toast } from 'common/utils';

export default function SignInForm({ setIsShowNotificationReset }) {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { control, handleSubmit } = useFormContext();
  const [, setCodeResetPwd] = useLocalStorage(CODE_RESET_KEY);
  const navigate = useNavigate();
  const resetToSingIn = () => {
    setIsForgotPassword(false);
    setFormItems(formItemsSignIn);
  };
  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    setFormItems((prev) => [
      prev.find((item) => item.key === 'logo'),
      {
        field: 'email',
        render: ({ field }) => {
          return (
            <Form.Item
              name='email'
              rules={[
                { required: true, message: 'Please input your email!' },
                {
                  required: true,
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
              ]}
            >
              <Input {...field} size='large' prefix={<UserOutlined />} placeholder={'Email'} />
            </Form.Item>
          );
        },
      },
      {
        render: () => (
          <Form.Item>
            <Button
              size='large'
              type='primary'
              htmlType='submit'
              className='login-form-button'
              style={{ width: '100%' }}
            >
              Send
            </Button>
          </Form.Item>
        ),
      },
      {
        render: () => (
          <Form.Item>
            <Flex gap='middle' justify='center'>
              <Link onClick={resetToSingIn}>Sign in</Link>
            </Flex>
          </Form.Item>
        ),
      },
    ]);
  };
  const formItemsSignIn = [
    {
      key: 'logo',
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
          <Input {...field} size='large' prefix={<UserOutlined />} placeholder={'Username, Email or Phone Number'} />
        );
      },
    },
    {
      field: 'password',
      render: ({ field }) => {
        return <Input.Password {...field} size='large' prefix={<LockOutlined />} placeholder='Password' />;
      },
    },
    {
      render: () => (
        <Link style={{ float: 'right' }} onClick={handleForgotPassword}>
          Forgot password
        </Link>
      ),
    },
    {
      render: () => (
        <Button size='large' type='primary' htmlType='submit' className='login-form-button' style={{ width: '100%' }}>
          Login
        </Button>
      ),
    },
    {
      render: () => (
        <Flex gap='middle' justify='center'>
          <Link onClick={() => navigate('/sign-up')}>Register now !</Link>
        </Flex>
      ),
    },
    {
      render: () => (
        <>
          <Divider plain>Or</Divider>
          <SocialsSignIn />
        </>
      ),
    },
  ];
  const [formItems, setFormItems] = useState(formItemsSignIn);
  const onSubmit = async (values) => {
    try {
      if (isForgotPassword) {
        const { data, errors } = await forgotPassword(values);
        if (errors) return toast.error(errors);
        setCodeResetPwd(data.code_reset);
        setIsShowNotificationReset(true);
        return;
      }

      const { errors } = await signIn(values);
      if (errors) return toast.error(errors);

      // redirect to page user access after login success
      // redirectTo('https://google.com');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <CTForm
      name='sign-in-form'
      items={formItems}
      global_control={control}
      onSubmit={handleSubmit(onSubmit)}
      isShowDefaultActions={false}
    />
  );
}
