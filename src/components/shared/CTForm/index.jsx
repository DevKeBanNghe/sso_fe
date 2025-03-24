import { Button, Form } from 'antd';
import useCurrentPage from 'hooks/useCurrentPage';
import { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useNavigate, useResolvedPath } from 'react-router-dom';
import CheckPermission from '../CheckPermission';
import { isEmpty, isFunction, isString } from 'lodash';
import { replaceParamsTemplate } from 'common/templates/helpers/common.helper';
import { getPlaceholderDefault } from 'common/utils/component.util';

export default function CTForm({
  name = 'form-template',
  global_control,
  items = [],
  onSubmit,
  actions: initActions = [],
  isShowActionDefault = true,
  permissionKeysDefaultAction = [],
  ...props
}) {
  const navigate = useNavigate();
  const { pathname } = useResolvedPath();
  const { id, isEdit, isView, queryParamsString, currentRoute } = useCurrentPage({ isPaging: false });

  const actions = useMemo(() => {
    if (!isShowActionDefault) return initActions;
    let defaultAction = {
      type: 'submit',
      content: id && isEdit ? 'Update' : 'Create',
    };
    if (isView) {
      defaultAction = {
        ...defaultAction,
        type: 'button',
        content: 'Edit',
        disabled: false,
        style: { backgroundColor: '#cb8d00' },
        onClick: (e) => {
          e.preventDefault();
          navigate(pathname.replace(id, `edit/${id}${queryParamsString}`));
        },
      };
    }
    return [defaultAction, ...initActions];
  }, [currentRoute]);

  const permissionKeysDefaultActionValue = useMemo(() => {
    const data = permissionKeysDefaultAction.find((item) => {
      if (isView || isEdit) return item.type === 'update';
      return item.type === 'create';
    });
    if (isEmpty(data)) return [];
    return data.permission_keys;
  }, [actions, permissionKeysDefaultAction]);

  return (
    <Form disabled={isView} name={name} initialValues={{ remember: true }} onFinish={onSubmit} {...props}>
      {items.map((item, index) => {
        const { key: keyItem, field, control, render, ...propsItem } = item;
        if (!isFunction(render)) return;
        const key = keyItem ?? `form_item_${index}`;
        const requiredRule = propsItem.rules?.required;
        if (requiredRule && isString(requiredRule)) {
          propsItem.rules.required = replaceParamsTemplate({
            template: requiredRule,
            params: {
              field: getPlaceholderDefault(field),
            },
          });
        }
        return item.field ? (
          <Form.Item key={key} name={item.field}>
            <Controller
              render={(props) => render({ ...props, ...propsItem, index })}
              control={control ?? global_control}
              name={field}
              {...propsItem}
            />
          </Form.Item>
        ) : (
          <Form.Item key={key}>
            <item.render items={items} index={index} />
          </Form.Item>
        );
      })}

      {actions.map(({ style = {}, type: htmlType, ...action }, index) => (
        <CheckPermission key={`actions-${name}-${index}`} permission_keys={permissionKeysDefaultActionValue}>
          <Form.Item>
            <Button
              disabled={action.disabled ?? isView}
              size='large'
              type='primary'
              htmlType={htmlType ?? 'submit'}
              className='login-form-button'
              style={{ width: '100%', ...style }}
              {...action}>
              {action.content ?? 'Submit'}
            </Button>
          </Form.Item>
        </CheckPermission>
      ))}
    </Form>
  );
}
