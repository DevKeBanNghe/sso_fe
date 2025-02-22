import CTList from 'components/shared/CTList';

export const columns = [
  {
    title: 'Roles',
    dataIndex: 'roles',
    key: 'roles',
    render: (value = []) => {
      if (value.length === 0) return <></>;
      return (
        <CTList
          list={value.map((item) => (
            <span key={item} style={{ width: '100%' }}>
              {item.role_name}
            </span>
          ))}
        />
      );
    },
  },
];
