import { Input } from 'antd';
import { getPlaceholderDefault } from 'common/utils/component.util';
import CTErrorMessage from 'components/shared/CTErrorMessage';
import { forwardRef } from 'react';

const InputPasswordCustom = (props, ref) => {
  return <Input.Password ref={ref} size='large' placeholder={getPlaceholderDefault(props.name)} {...props} />;
};

const CTInputPassword = CTErrorMessage(forwardRef(InputPasswordCustom));

export default CTInputPassword;
