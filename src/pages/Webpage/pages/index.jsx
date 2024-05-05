import { Row, Col } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import WebpageTable from '../components/WebpageTable';
import WebpageForm from '../components/WebpageForm';

export default function Webpages() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <Row>
        <Col span={'7'}>
          <WebpageForm />
        </Col>
        <Col span={'1'}></Col>
        <Col span={'16'}>
          <WebpageTable />
        </Col>
      </Row>
    </FormProvider>
  );
}
