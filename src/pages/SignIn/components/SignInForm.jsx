import { Button, Divider, Flex, Image, Input } from 'antd';
import CTForm from 'components/shared/CTForm';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Logo from 'images/logo.png';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import SocialsSignIn from './SocialsSignIn';
import { signIn } from '../service';
import { toast } from 'common/utils';
import { useMutation } from '@tanstack/react-query';
import CTInput from 'components/shared/CTInput';
import { redirectTo } from 'common/utils/common.util';
import useCurrentPage from 'hooks/useCurrentPage';

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
      field: 'password',
      render: ({ field }) => {
        return <Input.Password {...field} size='large' prefix={<LockOutlined />} placeholder='Password' />;
      },
    },
    {
      render: () => (
        <Link style={{ float: 'right' }} onClick={() => navigate('/forgot-password')}>
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
  const mutationSignIn = useMutation({
    mutationFn: signIn,
    onSuccess: ({ data, errors }) => {
      if (errors) return toast.error(errors);
      if (data.webpage_url) redirectTo(data.webpage_url);
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
      isShowDefaultActions={false}
    />
  );
}
