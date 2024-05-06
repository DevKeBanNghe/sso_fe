import { Button, Result } from 'antd';
import { useRef } from 'react';
import { useLocation, useNavigate, useRouteError } from 'react-router-dom';

const statusInstance = [
  { status: 404, title: 'Not Found' },
  { status: 500, title: 'Something went wrong! Please try again' },
  { status: 403, title: 'You are not allowed to access this page !' },
];

const Errors = () => {
  const error = useRouteError();
  const { state } = useLocation();
  const navigate = useNavigate();
  const statusRef = useRef(state?.status_code ?? 404);

  if (error) statusRef.current = 500;

  const { status, title } = statusInstance.find((item) => item.status === statusRef.current);
  return (
    <Result
      status={status}
      title={status}
      subTitle={title}
      extra={
        <Button onClick={() => navigate('/')} type='primary'>
          Back Home
        </Button>
      }
    />
  );
};

export default Errors;
