import { Input } from 'antd';
const { Search } = Input;

export default function SearchBar() {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  return <Search placeholder='Keyword ...' allowClear size='large' onSearch={onSearch} />;
}
