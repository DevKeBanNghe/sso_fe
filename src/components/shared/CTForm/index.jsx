import { Button, Form } from 'antd';
import useCurrentPage from 'hooks/useCurrentPage';
import { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useNavigate, useResolvedPath } from 'react-router-dom';

export default function CTForm({
  name = 'form-template',
  global_control,
  items = [],
  onSubmit,
  actions = [],
  isShowDefaultActions = true,
  ...props
}) {
  const navigate = useNavigate();
  const { pathname } = useResolvedPath();
  const { id, isEdit, isView } = useCurrentPage();

  const buttonSubmitProps = useMemo(() => {
    if (!isShowDefaultActions) return {};
    const btnProps = {
      type: 'submit',
      content: id && isEdit ? 'Update' : 'Create',
    };
    if (isView) {
      btnProps.type = 'button';
      btnProps.content = 'Edit';
      btnProps.disabled = false;
      btnProps.style = {
        backgroundColor: '#cb8d00',
      };
      btnProps.onClick = (e) => {
        e.preventDefault();
        navigate(pathname.replace(id, `edit/${id}`));
      };
    }
    return btnProps;
  }, [isView, id]);

  if (isShowDefaultActions) actions.unshift(buttonSubmitProps);

  return (
    <Form disabled={isView} name={name} initialValues={{ remember: true }} onFinish={onSubmit} {...props}>
      {items.map((item, index) => {
        if (!item.render) return;
        const key = item.key ?? `form_item_${index}`;
        return item.field ? (
          <Form.Item key={key} name={item.field}>
            <Controller
              render={(props) => item.render({ ...props, index })}
              control={item.control ?? global_control}
              name={item.field}
              rules={item.rules}
            />
          </Form.Item>
        ) : (
          <Form.Item key={key}>
            <item.render items={items} index={index} />
          </Form.Item>
        );
      })}

      {actions.map(({ style = {}, type: htmlType, ...action }, index) => (
        <Form.Item key={`actions-${name}-${index}`}>
          <Button
            disabled={action.disabled ?? isView}
            size='large'
            type='primary'
            htmlType={htmlType ?? 'submit'}
            className='login-form-button'
            style={{ width: '100%', ...style }}
            {...action}
          >
            {action.content ?? 'Submit'}
          </Button>
        </Form.Item>
      ))}
    </Form>
  );
}
