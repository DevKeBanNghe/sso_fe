import { Row, Col } from 'antd';
import PermissionTable from '../components/PermissionTable';
import PermissionForm from '../components/PermissionForm';
import { useRef } from 'react';

export default function Permissions() {
  const tableRef = useRef();
  return (
    <Row>
      <Col span={'7'}>
        <PermissionForm queryKeyFetchListTable={tableRef.current?.queryKey} />
      </Col>
      <Col span={'1'}></Col>
      <Col span={'16'}>
        <PermissionTable ref={tableRef} />
      </Col>
    </Row>
  );
}
