import { Button, Result } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useRouteError } from 'react-router-dom';

const statusInstance = [
  { status: 404, title: 'Not Found!' },
  { status: 500, title: 'Something went wrong! Please try again.' },
  { status: 403, title: 'You are not allowed to access this page!' },
];

const Errors = () => {
  const error = useRouteError();
  const { state = {} } = useLocation();
  const navigate = useNavigate();
  const [statusCode, setStatusCode] = useState(error ? 500 : 404);

  useEffect(() => {
    if (state?.status_code) setStatusCode(state.status_code);
  }, [state]);

  const { status, title } = statusInstance.find((item) => item.status === statusCode);
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
