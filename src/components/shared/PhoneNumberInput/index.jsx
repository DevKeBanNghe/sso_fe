import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Input } from 'antd';

const InputRef = (props, ref) => {
  const inputRef = useRef(null);
  useImperativeHandle(
    ref,
    () => {
      return inputRef.current.input;
    },
    [],
  );
  return <Input {...props} ref={inputRef} />;
};

const InputCustom = forwardRef(InputRef);

export default function PhoneNumberInput({ ...props }) {
  return (
    <PhoneInput
      international
      defaultCountry='VN'
      placeholder='Enter phone number'
      limitMaxLength
      inputComponent={InputCustom}
      {...props}
    />
  );
}
