import { useState } from 'react';
import { Tree } from 'antd';

const CTCheckboxTree = ({ data = [], onCheck = (value) => {}, checkedKeysDefault = [] }) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState(checkedKeysDefault);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheckValue = (checkedKeysValue) => {
    onCheck(checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };
  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheckValue}
      checkedKeys={checkedKeys}
      treeData={data}
    />
  );
};
export default CTCheckboxTree;
