import CTList from 'components/shared/CTList';

export const columns = [
  {
    title: 'Webpage Url',
    width: 70,
    dataIndex: 'webpage_url',
    key: 'webpage_url',
    fixed: 'left',
  },
  {
    title: 'Group Role',
    width: 70,
    dataIndex: 'GroupRole',
    key: 'GroupRole',
    render: (value = []) => {
      if (value.length === 0) return <></>;
      return <CTList list={value.map((item) => item.group_role_name)} />;
    },
  },
  {
    title: 'Webpage Description',
    width: 70,
    dataIndex: 'webpage_description',
    key: 'webpage_description',
  },
];
