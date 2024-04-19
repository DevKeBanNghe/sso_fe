import { Input, Button, Divider, Row, Col, Flex, Image, Form } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const { Link } = Typography;
import Logo from 'images/logo.png';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import CTForm from 'components/shared/CTForm';
import { forgotPassword, signIn } from '../service';
import { useState } from 'react';
import { toast } from 'common/utils';
import SocialsSignIn from '../components/SocialsSignIn';
import useLocalStorage from 'hooks/useLocalStorage';
import { CODE_RESET_KEY } from 'common/consts';
import { redirectTo } from 'common/utils/common.util';
import NotificationReset from './NotificationReset';

export default function SignIn() {
  const navigate = useNavigate();
  const methods = useForm();
  const { control, handleSubmit } = methods;
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isShowNotificationReset, setIsShowNotificationReset] = useState(false);
  const [, setCodeResetPwd] = useLocalStorage(CODE_RESET_KEY);

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
          <Form.Item name='user_name' rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input {...field} size='large' prefix={<UserOutlined />} placeholder={'Username, Email or Phone Number'} />
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
          <SocialsSignIn />
        </>
      ),
    },
  ];
  const [formItems, setFormItems] = useState(formItemsSignIn);

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

  const resetToSingIn = () => {
    setIsForgotPassword(false);
    setFormItems(formItemsSignIn);
  };

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
      redirectTo('https://google.com');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <FormProvider {...methods}>
      <Row justify='center'>
        <Col span={8}>
          {isShowNotificationReset ? (
            <NotificationReset />
          ) : (
            <CTForm name='sign-in-form' items={formItems} global_control={control} onSubmit={handleSubmit(onSubmit)} />
          )}
        </Col>
      </Row>
    </FormProvider>
  );
}
