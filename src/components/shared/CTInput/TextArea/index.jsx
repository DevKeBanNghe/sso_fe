import { Input } from 'antd';
import CTErrorMessage from '../../CTErrorMessage';
import { forwardRef } from 'react';
import { getPlaceholderDefault } from 'common/utils/component.util';

const InputTextAreaCustom = (props, ref) => {
  return <Input.TextArea ref={ref} autoSize size='large' placeholder={getPlaceholderDefault(props.name)} {...props} />;
};

const CTInputTextArea = CTErrorMessage(forwardRef(InputTextAreaCustom));

export default CTInputTextArea;
