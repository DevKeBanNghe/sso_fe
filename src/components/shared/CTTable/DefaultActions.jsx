import { DeleteTwoTone, EyeTwoTone, EditTwoTone, CopyTwoTone } from '@ant-design/icons';
import CTIcon from '../CTIcon';
import { Flex } from 'antd';

const createActions = ({ onEdit = () => {}, onView = () => {}, onDelete = () => {}, onCopy = () => {} }) => {
  const action_icons = [
    {
      icon: CopyTwoTone,
      onClick: onCopy,
      twoToneColor: '#00a67d',
    },
    {
      icon: EditTwoTone,
      onClick: onEdit,
      twoToneColor: '#cb8d00',
    },
    {
      icon: EyeTwoTone,
      onClick: onView,
    },
    {
      icon: DeleteTwoTone,
      onClick: onDelete,
      twoToneColor: '#e20145',
    },
  ];
  return [
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 30,
      render: (_, record) => {
        return (
          <Flex gap='middle' justify='center' wrap='wrap'>
            {action_icons.map(({ onClick, ...item }, index) => (
              <CTIcon
                key={`social_icon_${index}`}
                onClick={() => onClick(_, record)}
                style={{ fontSize: '22px' }}
                {...item}
              />
            ))}
          </Flex>
        );
      },
    },
  ];
};

export default createActions;
