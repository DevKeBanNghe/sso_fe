import { Row, Col } from 'antd';
import SignInForm from '../components/SignInForm';

export default function SignIn() {
  return (
    <Row justify='center'>
      <Col span={8}>
        <SignInForm />
      </Col>
    </Row>
  );
}
