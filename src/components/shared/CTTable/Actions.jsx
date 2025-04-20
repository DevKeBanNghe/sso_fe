import CTIcon from '../CTIcon';
import { Space, Switch } from 'antd';
import CheckPermission from '../CheckPermission';
import useCurrentPage from 'hooks/useCurrentPage';
import { useNavigate } from 'react-router-dom';
import {
  DeleteTwoTone,
  EyeTwoTone,
  EditTwoTone,
  CopyTwoTone,
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { isFunction } from 'lodash';
import { ACTIVATE_STATUS } from 'common/consts/constants.const';
import CTDropdown from '../CTDropdown';
import CTButton from '../CTButton';
import CTPopconfirm from '../CTPopconfirm';

export default function Actions({
  isShowActionDefault,
  actions = [],
  onGlobalDelete,
  dataRecord,
  onGlobalToggleActive,
}) {
  const { currentRootRoute, queryParamsString } = useCurrentPage({ isPaging: false });
  const navigate = useNavigate();
  const [tableActions, setTableActions] = useState(actions);

  useEffect(() => {
    if (!isShowActionDefault) return () => {};
    const actionsDefault = {
      copy: {
        icon: CopyTwoTone,
        twoToneColor: '#00a67d',
        onClick: ({ row_id }) => navigate(`${currentRootRoute}/copy/${row_id}${queryParamsString}`),
      },
      edit: {
        icon: EditTwoTone,
        twoToneColor: '#cb8d00',
        onClick: ({ row_id }) => navigate(`${currentRootRoute}/edit/${row_id}${queryParamsString}`),
      },
      view: {
        icon: EyeTwoTone,
        onClick: ({ row_id }) => navigate(`${currentRootRoute}/${row_id}${queryParamsString}`),
      },
      active: {
        render: ({ row_id, is_active }) => (
          <Switch
            key={row_id}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked={Boolean(is_active)}
            onChange={async (checked) => {
              if (!isFunction(onGlobalToggleActive)) return;
              const is_active = checked ? ACTIVATE_STATUS.ACTIVE : ACTIVATE_STATUS.INACTIVE;
              return await onGlobalToggleActive({ ids: [row_id], is_active });
            }}
          />
        ),
      },
      delete: {
        render: ({ row_id }) => {
          return (
            <CTPopconfirm title='Are you sure to delete this?' onConfirm={() => onGlobalDelete([row_id])}>
              <CTIcon twoToneColor={'#e20145'} icon={DeleteTwoTone} style={{ fontSize: '22px' }} />
            </CTPopconfirm>
          );
        },
      },
    };
    for (const action of actions) {
      if (!action.type) continue;
      actionsDefault[action.type] = {
        ...actionsDefault[action.type],
        ...action,
      };
    }
    setTableActions(Object.values(actionsDefault));
  }, [dataRecord]);

  return (
    <CTDropdown
      items={tableActions.map(({ onClick, permission_keys, render: Render, ...item }, index) => ({
        key: `social_icon_${index}`,
        label: (
          <CheckPermission permission_keys={permission_keys} key={`social_icon_${index}`}>
            {isFunction(Render) ? (
              <Render {...dataRecord} key={`render_${index}`} />
            ) : (
              <CTIcon onClick={() => onClick(dataRecord)} style={{ fontSize: '22px' }} {...item} />
            )}
          </CheckPermission>
        ),
      }))}
    >
      <Space>
        <CTButton icon={<DownOutlined />}></CTButton>
      </Space>
    </CTDropdown>
  );
}
