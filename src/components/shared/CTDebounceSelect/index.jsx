import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import CTErrorMessage from '../CTErrorMessage';
const DebounceSelect = ({ fetchOptions = async () => {}, debounceTimeout = 800, ...props }, ref) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const loadOptions = useCallback(
    (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    },
    [fetchOptions],
  );
  const debounceFetcher = useMemo(() => debounce(loadOptions, debounceTimeout), [loadOptions, debounceTimeout]);

  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <Select
      ref={ref}
      allowClear
      showSearch={true}
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      options={options}
      size='large'
      {...props}
    />
  );
};

const CTDebounceSelect = CTErrorMessage(forwardRef(DebounceSelect));

export default CTDebounceSelect;
