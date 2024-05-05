import { Input, Button, Divider, Flex, Image, DatePicker } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
const { Link } = Typography;
import Logo from 'images/logo.png';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import CTForm from 'components/shared/CTForm';
import { signUp } from '../service';
import { antdDateToStringDate, toast } from 'common/utils';
import PhoneNumberInput from 'components/shared/PhoneNumberInput';
import SocialsSignUp from './SocialsSignUp';
export default function SignUpForm() {
  const navigate = useNavigate();
  const { control, handleSubmit, watch } = useForm();

  const onSubmit = async (data) => {
    data.date_of_birth = antdDateToStringDate({ value: data.date_of_birth });
    try {
      const { data, errors } = await signUp(data);
      if (errors) toast.error(errors);
    } catch (error) {
      toast.error(error.message);
    }
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
        return <Input {...field} size='large' prefix={<MailOutlined />} placeholder='Email' />;
      },
    },
    {
      field: 'date_of_birth',
      render: ({ field }) => {
        return (
          <Flex gap={'15px'}>
            <Controller
              name='phone_number'
              control={control}
              render={({ field: fieldPhoneNumber }) => {
                return <PhoneNumberInput size='large' {...fieldPhoneNumber} />;
              }}
            />
            <DatePicker placeholder='Date of birth' size='large' format={'DD/MM/YYYY'} {...field} />
          </Flex>
        );
      },
    },
    {
      field: 'user_name',
      render: ({ field }) => {
        return <Input {...field} size='large' prefix={<UserOutlined />} placeholder='Username' />;
      },
    },
    {
      field: 'password',
      render: ({ field }) => {
        return <Input.Password {...field} size='large' prefix={<LockOutlined />} placeholder='Password' />;
      },
    },
    {
      field: 'confirm_password',
      render: ({ field }) => {
        return (
          <Input.Password
            disabled={!watch('password')}
            {...field}
            size='large'
            prefix={<LockOutlined />}
            placeholder='Confirm Password'
          />
        );
      },
    },
    {
      render: () => (
        <Button size='large' type='primary' htmlType='submit' className='login-form-button' style={{ width: '100%' }}>
          Sign Up
        </Button>
      ),
    },
    {
      render: () => (
        <Flex gap='middle' justify='center'>
          <Link onClick={() => navigate('/sign-in')}>Sign In now !</Link>
        </Flex>
      ),
    },
    {
      render: () => (
        <>
          <Divider plain>Or</Divider>
          <SocialsSignUp />
        </>
      ),
    },
  ];
  return (
    <CTForm
      name='sign-up-form'
      items={items}
      global_control={control}
      onSubmit={handleSubmit(onSubmit)}
      isShowDefaultActions={false}
    />
  );
}