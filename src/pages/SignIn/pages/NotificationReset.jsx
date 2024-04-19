import { Alert, Button, Space } from 'antd';
import { CODE_RESET_KEY } from 'common/consts';
import { toast } from 'common/utils';
import useLocalStorage from 'hooks/useLocalStorage';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { forgotPassword } from '../service';

export default function NotificationReset() {
  const RESEND_TIME = 3;
  const RETRY_TIME_MAX = 3;
  const { watch } = useFormContext();
  const [count, setCount] = useState(RESEND_TIME);
  const [, setCodeResetPwd] = useLocalStorage(CODE_RESET_KEY);
  const [isCount, setIsCount] = useState(false);
  const retryTime = useRef(0);
  const isDisabled = retryTime.current === RETRY_TIME_MAX ? true : isCount && count >= 0;
  const handleResend = async () => {
    setIsCount(true);
    const { data, errors } = await forgotPassword({ email: watch('email') });
    if (errors) return toast.error(errors);
    setCodeResetPwd(data.code_reset);
    retryTime.current++;
    if (retryTime.current === RETRY_TIME_MAX) {
      return toast.error('Too many resend!');
    }
  };

  useEffect(() => {
    if (!isCount) return () => {};
    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount === 0) {
          clearInterval(timer);
          setIsCount(false);
          setCount(RESEND_TIME);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCount]);
  return (
    <>
      <Alert
        message={'Request reset password success'}
        description='Check your email to reset password'
        type='success'
        showIcon
        style={{ marginTop: '20px' }}
      />

      <Space style={{ float: 'right', marginTop: '10px' }}>
        Not receive?{' '}
        <Button disabled={isDisabled} onClick={handleResend}>
          {isCount && count >= 0 ? `Try again after ${count}s` : `Resend`}
        </Button>
      </Space>
    </>
  );
}
