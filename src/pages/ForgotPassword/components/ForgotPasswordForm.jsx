import { Button, Flex, Image } from 'antd';
import CTForm from 'components/shared/CTForm';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Logo from 'images/logo.png';
import useLocalStorage from 'hooks/useLocalStorage';
import { CODE_RESET_KEY } from 'common/consts/local-storage.const';
import { UserOutlined } from '@ant-design/icons';
import { forgotPassword } from '../service';
import { toast } from 'common/utils/toast.util';
import { useMutation } from '@tanstack/react-query';
import CTInput from 'components/shared/CTInput';
import { delay } from 'lodash';
import { useState } from 'react';

export default function ForgotPasswordForm() {
  const APP_URL = import.meta.env.VITE_APP_URL;
  const APP_PREFIX = import.meta.env.VITE_APP_PREFIX;
  const { control, handleSubmit, watch } = useForm();
  const [, setCodeReset] = useLocalStorage(CODE_RESET_KEY);
  const [isSending, setIsSending] = useState(false);

  const navigate = useNavigate();
  const formItems = [
    {
      key: 'logo',
      render: () => (
        <Flex gap='middle' justify='center'>
          <Image style={{ cursor: 'pointer' }} onClick={() => navigate('/')} preview={false} width={200} src={Logo} />
        </Flex>
      ),
    },
    {
      field: 'email',
      render: ({ field }) => {
        return <CTInput {...field} prefix={<UserOutlined />} placeholder={'Email'} />;
      },
    },
    {
      render: () => (
        <Button
          loading={isSending}
          size='large'
          type='primary'
          htmlType='submit'
          className='login-form-button'
          style={{ width: '100%' }}>
          Send
        </Button>
      ),
    },
    {
      render: () => (
        <Flex gap='middle' justify='center'>
          <Link onClick={() => navigate('/sign-in')}>Sign in</Link>
        </Flex>
      ),
    },
  ];

  const mutationForgotPassword = useMutation({
    mutationFn: forgotPassword,
    onSuccess: ({ data, errors }) => {
      if (errors) return toast.error(errors);
      setCodeReset(data.code_reset);
      setIsSending(true);
      delay(
        () =>
          navigate('/notification-reset', {
            state: {
              email: watch('email'),
            },
          }),
        2000,
      );
    },
  });

  const onSubmit = async (values) => {
    try {
      mutationForgotPassword.mutate({
        ...values,
        redirect_to: `${APP_URL}${APP_PREFIX === '/' ? '' : '/'}reset-password`,
      });
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
