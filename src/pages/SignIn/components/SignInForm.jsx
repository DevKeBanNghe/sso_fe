import { Button, Divider, Flex, Image, Input } from 'antd';
import CTForm from 'components/shared/CTForm';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Logo from 'images/logo.png';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import SocialsSignIn from './SocialsSignIn';
import { signIn } from '../service';
import { toast } from 'common/utils/toast.util';
import { useMutation } from '@tanstack/react-query';
import CTInput from 'components/shared/CTInput';
import useCurrentPage from 'hooks/useCurrentPage';
import { redirectTo } from 'common/utils/common.util';

export default function SignInForm() {
  const { control, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { queryParams } = useCurrentPage({ isPaging: false });
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
      field: 'user_name',
      render: ({ field }) => {
        return <CTInput {...field} prefix={<UserOutlined />} placeholder={'Username, Email or Phone Number'} />;
      },
    },
    {
      field: 'user_password',
      render: ({ field }) => {
        return (
          <>
            <Input.Password {...field} size='large' prefix={<LockOutlined />} placeholder='Password' />
            <Link style={{ float: 'right' }} onClick={() => navigate('/forgot-password')}>
              Forgot password
            </Link>
          </>
        );
      },
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
          <Link onClick={() => navigate('/sign-up')}>Register now!</Link>
        </Flex>
      ),
    },
    {
      render: () => (
        <>
          <Divider plain style={{ marginTop: 0 }}>
            Or sign in with
          </Divider>
          <SocialsSignIn />
        </>
      ),
    },
  ];
  const mutationSignIn = useMutation({
    mutationFn: signIn,
    onSuccess: ({ data = {}, errors }) => {
      if (errors) return toast.error(errors);
      const { webpage_url, user_id } = data;
      return redirectTo(webpage_url ? `${webpage_url}?user_id=${user_id}` : '/');
    },
  });

  const onSubmit = async (values) => {
    try {
      mutationSignIn.mutate({ ...values, webpage_key: queryParams.webpage_key });
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
      isShowActionDefault={false}
    />
  );
}
