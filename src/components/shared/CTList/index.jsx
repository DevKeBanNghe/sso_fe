import { List } from 'antd';
const { Item } = List;
const CTList = ({ list = [], renderItem = (item) => <Item>{item}</Item>, ...props }) => (
  <List size='small' bordered dataSource={list} renderItem={renderItem} {...props} />
);
export default CTList;
