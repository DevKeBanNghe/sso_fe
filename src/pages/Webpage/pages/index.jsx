import { Row, Col } from 'antd';
import WebpageTable from '../components/WebpageTable';
import WebpageForm from '../components/WebpageForm';
import { useRef } from 'react';

export default function Webpages() {
  const tableRef = useRef();
  return (
    <Row>
      <Col span={'7'}>
        <WebpageForm queryKeyFetchListTable={tableRef.current?.queryKey} />
      </Col>
      <Col span={'1'}></Col>
      <Col span={'16'}>
        <WebpageTable ref={tableRef} />
      </Col>
    </Row>
  );
}
