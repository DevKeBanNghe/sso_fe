import { Input } from 'antd';
import CTErrorMessage from '../CTErrorMessage';
import { forwardRef } from 'react';

const InputCustom = ({ placeholder, ...props }, ref) => {
  return <Input.TextArea ref={ref} autoSize size='large' placeholder={placeholder} {...props} />;
};

const CTInput = CTErrorMessage(forwardRef(InputCustom));

export default CTInput;
