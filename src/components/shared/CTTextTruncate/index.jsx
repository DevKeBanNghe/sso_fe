import { Typography } from 'antd';
import { useMemo, useState } from 'react';
const { Text, Link } = Typography;
const CTTextTruncate = ({ children, maxLength = 50, ...props }) => {
  const [isHide, setIsHide] = useState(true);
  const text = useMemo(() => {
    if (!children || typeof children !== 'string') return '';
    if (isHide) {
      const backSpaceIndex = children.lastIndexOf(' ', maxLength);
      return children ? `${children.slice(0, backSpaceIndex)}...` : '';
    }
    return children;
  }, [isHide, children]);

  return (
    <Text {...props}>
      {text && (
        <>
          {text} <Link onClick={() => setIsHide(!isHide)}> {isHide ? 'more' : 'hide'}</Link>
        </>
      )}
    </Text>
  );
};
export default CTTextTruncate;
