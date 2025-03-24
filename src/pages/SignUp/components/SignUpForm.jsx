import { Button, Divider, Flex, Image, DatePicker } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import Logo from 'images/logo.png';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import CTForm from 'components/shared/CTForm';
import { signUp } from '../service';
import { toast } from 'common/utils/toast.util';
import { antdDateToStringDate } from 'common/utils/date.util';
import PhoneNumberInput from 'components/shared/PhoneNumberInput';
import SocialsSignUp from './SocialsSignUp';
import { useMutation } from '@tanstack/react-query';
import CTInput from 'components/shared/CTInput';
import { redirectTo } from 'common/utils/common.util';
import CTInputPassword from 'components/shared/CTInput/InputPassword';
import { REQUIRED_FIELD_TEMPLATE } from 'common/templates/rules.template';
const { Link } = Typography;
export default function SignUpForm() {
  const navigate = useNavigate();
  const { control, handleSubmit, watch } = useForm();

  const mutationSignUp = useMutation({
    mutationFn: signUp,
    onSuccess: ({ data, errors }) => {
      if (errors) return toast.error(errors);
      toast.success('Sign up success');
      if (data.webpage_url) return redirectTo(data.webpage_url);
      navigate('/');
    },
  });

  const onSubmit = async (values) => {
    values.user_date_of_birth = antdDateToStringDate({ value: values.user_date_of_birth });
    delete values.confirm_password;
    try {
      mutationSignUp.mutate(values);
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
      rules: {
        required: REQUIRED_FIELD_TEMPLATE,
      },
      field: 'user_email',
      render: ({ field, formState: { errors }, rules }) => {
        return (
          <CTInput formStateErrors={errors} rules={rules} {...field} prefix={<MailOutlined />} placeholder='Email' />
        );
      },
    },
    {
      field: 'user_date_of_birth',
      render: ({ field }) => {
        return (
          <Flex gap={'15px'}>
            <Controller
              name='user_phone_number'
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
        return <CTInput {...field} prefix={<UserOutlined />} />;
      },
    },
    {
      rules: {
        required: REQUIRED_FIELD_TEMPLATE,
      },
      field: 'user_password',
      render: ({ field, formState: { errors }, rules }) => {
        return (
          <CTInputPassword
            formStateErrors={errors}
            rules={rules}
            {...field}
            size='large'
            prefix={<LockOutlined />}
            placeholder='Password'
          />
        );
      },
    },
    {
      rules: {
        required: REQUIRED_FIELD_TEMPLATE,
      },
      field: 'confirm_password',
      render: ({ field, formState: { errors }, rules }) => {
        return (
          <CTInputPassword
            formStateErrors={errors}
            disabled={!watch('user_password')}
            rules={rules}
            {...field}
            size='large'
            prefix={<LockOutlined />}
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
      isShowActionDefault={false}
    />
  );
}
