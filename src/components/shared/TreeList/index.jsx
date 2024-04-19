import { useMemo, useState } from 'react';
import { Tree } from 'antd';

export default function TreeList({ list = [] }) {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  const handleSelect = (keys, info) => {
    console.log('Trigger Select', keys, info);
  };
  const treeData = useMemo(() => {
    const loop = (data) =>
      data.map((item) => {
        const title = item.title;
        if (item.children) {
          return {
            title,
            key: item.key,
            children: loop(item.children),
          };
        }
        return {
          title,
          key: item.key,
        };
      });
    return loop(list);
  }, [list]);
  return (
    <div>
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        onSelect={handleSelect}
      />
    </div>
  );
}
