import CTTextTruncate from 'components/shared/CTTextTruncate';

export const columns = [
  {
    title: 'Role Name',
    width: 50,
    dataIndex: 'role_name',
    key: 'role_name',
    fixed: 'left',
  },
  {
    title: 'Role Description',
    width: 50,
    dataIndex: 'role_description',
    key: 'role_description',
    render: (value) => <CTTextTruncate>{value}</CTTextTruncate>,
  },
];
