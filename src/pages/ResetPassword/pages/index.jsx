import { Input, Button, Row, Col, Flex, Image, Form } from 'antd';
import { LockOutlined } from '@ant-design/icons';

import Logo from 'images/logo.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CTForm from 'components/shared/CTForm';
import { resetPassword } from '../service';
import { toast } from 'common/utils';
import useLocalStorage from 'hooks/useLocalStorage';
import { CODE_RESET_KEY } from 'common/consts';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [codeReset] = useLocalStorage(CODE_RESET_KEY);
  const {
    formState: { errors },
    control,
    handleSubmit,
    watch,
  } = useForm();

  const onSubmit = async (values) => {
    try {
      const { errors, message } = await resetPassword({ ...values, code_reset: codeReset });
      if (errors) return toast.error(errors);
      toast.success(message);
      return navigate('/sign-in');
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
      field: 'password',
      render: ({ field }) => {
        return (
          <Form.Item
            name='password'
            rules={[
              { required: true, message: 'Please input your new password!' },
              // {
              //   pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              //   message:
              //     'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character',
              // },
            ]}
          >
            <Input.Password {...field} size='large' prefix={<LockOutlined />} placeholder='New Password' />
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
            ]}
          >
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
            Confirm
          </Button>
        </Form.Item>
      ),
    },
  ];

  return (
    <Row justify='center'>
      <Col span={8}>
        <CTForm name='reset-password-form' items={items} global_control={control} onSubmit={handleSubmit(onSubmit)} />
      </Col>
    </Row>
  );
}
