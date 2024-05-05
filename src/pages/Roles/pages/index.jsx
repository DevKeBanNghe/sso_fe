import { Row, Col } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import RoleTable from '../components/RoleTable';
import RoleForm from '../components/RoleForm';

export default function Roles() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <Row>
        <Col span={'7'}>
          <RoleForm />
        </Col>
        <Col span={'1'}></Col>
        <Col span={'16'}>
          <RoleTable />
        </Col>
      </Row>
    </FormProvider>
  );
}
