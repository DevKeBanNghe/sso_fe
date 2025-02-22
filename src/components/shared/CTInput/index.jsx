import { Input } from 'antd';
import CTErrorMessage from '../CTErrorMessage';
import { forwardRef } from 'react';
import { getPlaceholderDefault } from 'common/utils/component.util';
import { isArray } from 'lodash';

const InputCustom = ({ rules, ...props }, ref) => {
  const isRequired = isArray(rules) ? rules.some((rule) => rule.required) : rules?.required;
  return (
    <Input
      prefix={isRequired ? <span style={{ color: 'red' }}>*</span> : null}
      ref={ref}
      size='large'
      placeholder={getPlaceholderDefault(props.name)}
      {...props}
    />
  );
};

const CTInput = CTErrorMessage(forwardRef(InputCustom));

export default CTInput;
