import { useEffect } from 'react';

function useInterval(cb, time = 1000) {
  useEffect(() => {
    const intervalInstance = setInterval(cb, time);
    return () => clearInterval(intervalInstance);
  }, []);
}

export default useInterval;
