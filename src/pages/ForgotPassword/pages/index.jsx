import { Row, Col } from 'antd';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <Row justify='center'>
      <Col span={8}>
        <ForgotPasswordForm />
      </Col>
    </Row>
  );
}
