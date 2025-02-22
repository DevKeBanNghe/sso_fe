import { Row, Col } from 'antd';
import RoleTable from '../components/RoleTable';
import RoleForm from '../components/RoleForm';

export default function Roles() {
  return (
    <Row>
      <Col span={'6'}>
        <RoleForm />
      </Col>
      <Col span={'1'}></Col>
      <Col span={'17'}>
        <RoleTable />
      </Col>
    </Row>
  );
}
