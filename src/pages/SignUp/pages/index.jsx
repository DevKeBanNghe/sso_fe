import { Row, Col } from 'antd';
import SignUpForm from '../components/SignUpForm';

export default function SignUp() {
  return (
    <Row justify='center'>
      <Col span={8}>
        <SignUpForm />
      </Col>
    </Row>
  );
}
