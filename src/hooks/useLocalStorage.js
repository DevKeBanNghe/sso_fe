import { useEffect, useState } from 'react';

export default function useLocalStorage(key, defaultValue = window.localStorage.getItem(key) ?? '') {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (key) window.localStorage.setItem(key, JSON.parse(JSON.stringify(value)));
  }, [key, value]);

  return [value, setValue];
}
