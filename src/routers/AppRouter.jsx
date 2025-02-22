import React from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { Routes, OutsideRoutes } from './Routes';
import { store } from 'reduxApp/store';
import { getUserInfo } from 'common/reducers/user/user.action';

store.dispatch(getUserInfo());
const router = createBrowserRouter(createRoutesFromElements([Routes(), ...OutsideRoutes()]));
function AppRouter() {
  return (
    <React.Suspense fallback={null}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
}

export default AppRouter;
