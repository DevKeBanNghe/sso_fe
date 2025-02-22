import { Row, Col } from 'antd';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';

export default function Users() {
  return (
    <Row>
      <Col span={'7'}>
        <UserForm />
      </Col>
      <Col span={'1'}></Col>
      <Col span={'16'}>
        <UserTable />
      </Col>
    </Row>
  );
}
