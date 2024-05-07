import { Row, Col } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';
import { genUUID } from 'common/utils';

export default function Users() {
  const methods = useForm({
    defaultValues: {
      user_password: genUUID(),
    },
  });

  return (
    <FormProvider {...methods}>
      <Row>
        <Col span={'7'}>
          <UserForm />
        </Col>
        <Col span={'1'}></Col>
        <Col span={'16'}>
          <UserTable />
        </Col>
      </Row>
    </FormProvider>
  );
}
