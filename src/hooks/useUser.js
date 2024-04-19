import { setUser } from 'common/reducers/user.reducer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useUser() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setUser({
        data: {
          hello: 'world',
        },
        type: 'action',
      }),
    );
  }, [dispatch]);
  return user;
}
