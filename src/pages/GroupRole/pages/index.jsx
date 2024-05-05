import { Row, Col } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import GroupRoleTable from '../components/GroupRoleTable';
import GroupRoleForm from '../components/GroupRoleForm';

export default function GroupRoles() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <Row>
        <Col span={'7'}>
          <GroupRoleForm />
        </Col>
        <Col span={'1'}></Col>
        <Col span={'16'}>
          <GroupRoleTable />
        </Col>
      </Row>
    </FormProvider>
  );
}
