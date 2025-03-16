import { Row, Col } from 'antd';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';
import { useRef } from 'react';

export default function Users() {
  const tableRef = useRef();
  return (
    <Row>
      <Col span={'7'}>
        <UserForm queryKeyFetchListTable={tableRef.current?.queryKey} />
      </Col>
      <Col span={'1'}></Col>
      <Col span={'16'}>
        <UserTable ref={tableRef} />
      </Col>
    </Row>
  );
}
