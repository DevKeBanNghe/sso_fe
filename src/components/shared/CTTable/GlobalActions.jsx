import { Badge, Button, Flex } from 'antd';
import CTButton from '../CTButton';
import CTPopconfirm from '../CTPopconfirm';
import { ACTIVATE_STATUS } from 'common/consts/constants.const';
import { isFunction, startCase } from 'lodash';

function GlobalActions({
  actions = [],
  selectedRowsRef,
  selectedRowKeys,
  setSelectedRowKeys,
  onGlobalDelete,
  onGlobalToggleActive,
  onGlobalExport,
  isShowGlobalActionsDefault,
}) {
  const handleClearAllChecked = () => {
    selectedRowsRef.current.clear();
    setSelectedRowKeys([]);
  };

  const itemsSelected = selectedRowKeys.length;
  const globalActionsSelectedDefault = {
    clear: {
      style: { background: '#ffffb8' },
      onClick: handleClearAllChecked,
    },
    delete: {
      style: { background: '#ffccc7' },
      render: () => (
        <CTPopconfirm
          title={`Are you sure to delete ${itemsSelected} items?`}
          onConfirm={() => {
            onGlobalDelete(selectedRowKeys);
            handleClearAllChecked();
          }}>
          <Button style={{ background: '#ffccc7' }}>Delete</Button>
        </CTPopconfirm>
      ),
    },
    active: {
      style: { background: '#bae7ff' },
      onClick: () => {
        onGlobalToggleActive({ ids: selectedRowKeys, is_active: ACTIVATE_STATUS.ACTIVE });
        handleClearAllChecked();
      },
    },
    deactive: {
      style: { background: '#d9d9d9' },
      onClick: () => {
        onGlobalToggleActive({ ids: selectedRowKeys, is_active: ACTIVATE_STATUS.INACTIVE });
        handleClearAllChecked();
      },
    },
    export: {
      style: { background: '#95de64' },
      onClick: () => onGlobalExport(selectedRowKeys),
    },
  };

  const globalActionsDefault = {
    exportAll: {
      style: { background: '#95de64' },
      onClick: () => onGlobalExport(),
    },
  };

  return (
    <Flex gap={'middle'} wrap='wrap'>
      {itemsSelected > 0 ? (
        <>
          {Object.entries(globalActionsSelectedDefault).map(([action, { onClick, render, ...props }]) => (
            <Badge key={action} count={itemsSelected}>
              {isFunction(render) ? (
                render()
              ) : (
                <Button onClick={onClick} {...props}>
                  {startCase(action)}
                </Button>
              )}
            </Badge>
          ))}
        </>
      ) : (
        <></>
      )}
      {isShowGlobalActionsDefault ? (
        Object.entries(globalActionsDefault).map(([action, { onClick, render, ...props }]) => (
          <Badge key={action}>
            {isFunction(render) ? (
              render()
            ) : (
              <Button onClick={onClick} {...props}>
                {startCase(action)}
              </Button>
            )}
          </Badge>
        ))
      ) : (
        <></>
      )}
      {actions.map(({ content, render, ...props }, index) =>
        isFunction(render) ? (
          render()
        ) : (
          <CTButton key={`global_actions_${index}`} type='primary' {...props}>
            {content}
          </CTButton>
        ),
      )}
    </Flex>
  );
}

export default GlobalActions;
