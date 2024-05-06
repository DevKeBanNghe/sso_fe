import React, { useEffect } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Routes from './Routes';
import { useDispatch } from 'react-redux';
import { getUserInfo } from 'common/reducers/user.action';

const router = createBrowserRouter(createRoutesFromElements(Routes()));
function AppRouter() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserInfo());
  }, []);

  return (
    <React.Suspense fallback={null}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
}

export default AppRouter;
