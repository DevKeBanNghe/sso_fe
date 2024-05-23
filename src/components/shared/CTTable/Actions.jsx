import CTIcon from '../CTIcon';
import { Flex } from 'antd';
import CheckPermission from '../CheckPermission';
import useCurrentPage from 'hooks/useCurrentPage';
import { useNavigate } from 'react-router-dom';
import { DeleteTwoTone, EyeTwoTone, EditTwoTone, CopyTwoTone } from '@ant-design/icons';
import { useEffect, useState } from 'react';

export default function Actions({ isShowDefaultActions, actions = [], onGlobalDelete, dataRecord }) {
  const { currentRootRoute, queryParamsString } = useCurrentPage({ isPaging: false });
  const navigate = useNavigate();
  const [tableActions, setTableActions] = useState(actions);

  useEffect(() => {
    if (!isShowDefaultActions) return () => {};
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
      delete: {
        icon: DeleteTwoTone,
        twoToneColor: '#e20145',
        onClick: ({ row_id }) => onGlobalDelete([row_id]),
      },
    };
    for (const action of actions) {
      if (!action.type) continue;
      actionsDefault[action.type] = {
        ...actionsDefault[action.type],
        ...action,
      };
    }
    setTableActions((prev) => [...Object.values(actionsDefault), ...prev]);
  }, []);

  return (
    <Flex gap='middle' justify='center' wrap='wrap'>
      {tableActions.map(({ onClick, permission_key, ...item }, index) => (
        <CheckPermission permission_keys={permission_key} key={`social_icon_${index}`}>
          <CTIcon onClick={() => onClick(dataRecord)} style={{ fontSize: '22px' }} {...item} />
        </CheckPermission>
      ))}
    </Flex>
  );
}
