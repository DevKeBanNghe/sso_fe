import { Input } from 'antd';
import useCurrentPage from 'hooks/useCurrentPage';
const { Search } = Input;

function SearchBar({ onSearch, ...props }) {
  const { queryParams } = useCurrentPage({ isPaging: false });
  return (
    <Search
      defaultValue={queryParams?.search}
      placeholder='Search'
      allowClear
      size='large'
      onSearch={onSearch}
      {...props}
    />
  );
}

export default SearchBar;
