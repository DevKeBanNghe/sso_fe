import { Row, Col } from 'antd';
import PermissionTable from '../components/PermissionTable';
import PermissionForm from '../components/PermissionForm';

export default function Permissions() {
  return (
    <Row>
      <Col span={'7'}>
        <PermissionForm />
      </Col>

      <Col span={'1'}></Col>

      <Col span={'16'}>
        <PermissionTable />
      </Col>
    </Row>
  );
}
