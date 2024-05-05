import { Row, Col } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import PermissionTable from '../components/PermissionTable';
import PermissionForm from '../components/PermissionForm';

export default function Permissions() {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <Row>
        <Col span={'7'}>
          <PermissionForm />
        </Col>
        <Col span={'1'}></Col>
        <Col span={'16'}>
          <PermissionTable />
        </Col>
      </Row>
    </FormProvider>
  );
}
