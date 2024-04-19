import { Form } from 'antd';
import _ from 'lodash';
import { Controller } from 'react-hook-form';

export default function CTForm({ name = 'form-template', global_control, items = [], onSubmit, ...configs }) {
  return (
    <Form name={name} initialValues={{ remember: true }} onFinish={onSubmit} {...configs}>
      {items.map((item, index) => {
        if (!item.render) return;
        const key = item.key ?? `form_item_${index}`;
        return item.field ? (
          <Controller
            key={key}
            render={(props) => item.render({ ...props, index })}
            control={item.control ?? global_control}
            name={item.field}
          />
        ) : (
          <item.render items={items} index={index} key={key} />
        );
      })}
    </Form>
  );
}
