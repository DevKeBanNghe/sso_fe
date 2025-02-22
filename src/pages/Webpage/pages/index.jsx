import { Row, Col } from 'antd';
import WebpageTable from '../components/WebpageTable';
import WebpageForm from '../components/WebpageForm';

export default function Webpages() {
  return (
    <Row>
      <Col span={'7'}>
        <WebpageForm />
      </Col>
      <Col span={'1'}></Col>
      <Col span={'16'}>
        <WebpageTable />
      </Col>
    </Row>
  );
}
