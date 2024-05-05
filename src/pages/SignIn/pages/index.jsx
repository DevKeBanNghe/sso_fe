import { Row, Col } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';
import NotificationReset from './NotificationReset';
import SignInForm from '../components/SignInForm';

export default function SignIn() {
  const methods = useForm();
  const [isShowNotificationReset, setIsShowNotificationReset] = useState(false);

  return (
    <FormProvider {...methods}>
      <Row justify='center'>
        <Col span={8}>
          {isShowNotificationReset ? (
            <NotificationReset />
          ) : (
            <SignInForm setIsShowNotificationReset={setIsShowNotificationReset} />
          )}
        </Col>
      </Row>
    </FormProvider>
  );
}
