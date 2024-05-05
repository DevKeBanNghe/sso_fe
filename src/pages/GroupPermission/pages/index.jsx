import { Row, Col } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import GroupPermissionTable from '../components/GroupPermissionTable';
import GroupPermissionForm from '../components/GroupPermissionForm';

export default function GroupPermissions() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <Row>
        <Col span={'7'}>
          <GroupPermissionForm />
        </Col>
        <Col span={'1'}></Col>
        <Col span={'16'}>
          <GroupPermissionTable />
        </Col>
      </Row>
    </FormProvider>
  );
}
