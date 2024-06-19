import CTTextTruncate from 'components/shared/CTTextTruncate';

export const columns = [
  {
    title: 'User Name',
    width: 50,
    dataIndex: 'user_name',
    key: 'user_name',
    fixed: 'left',
  },
  // {
  //   title: 'Role',
  //   width: 50,
  //   dataIndex: 'Role',
  //   key: 'Role',
  //   render: (value) => value.role_name,
  // },
  {
    title: 'User Description',
    width: 50,
    dataIndex: 'user_description',
    key: 'user_description',
    render: (value) => {
      return <CTTextTruncate>{value}</CTTextTruncate>;
    },
  },
];
