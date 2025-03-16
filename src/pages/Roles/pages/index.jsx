import { Row, Col } from 'antd';
import RoleTable from '../components/RoleTable';
import RoleForm from '../components/RoleForm';
import { useRef } from 'react';

export default function Roles() {
  const tableRef = useRef();
  return (
    <Row>
      <Col span={'6'}>
        <RoleForm queryKeyFetchListTable={tableRef.current?.queryKey} />
      </Col>
      <Col span={'1'}></Col>
      <Col span={'17'}>
        <RoleTable ref={tableRef} />
      </Col>
    </Row>
  );
}
