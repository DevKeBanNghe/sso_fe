import { Route } from 'react-router-dom';
import HomePage from 'layouts/HomePage';
import Errors from 'layouts/ErrorsPage';
import useVerifyAccess from 'hooks/useVerifyAccess';
import { routers } from 'routers';
import SignIn from 'pages/SignIn/pages';
import SignUp from 'pages/SignUp/pages';
import ResetPassword from 'pages/ResetPassword/pages';

const homePageRouter = { path: '/', component: HomePage, exact: true };
const outsideRouter = [
  {
    path: '/sign-in',
    component: SignIn,
    exact: true,
  },
  {
    path: '/sign-up',
    component: SignUp,
    exact: true,
  },
  {
    path: '/reset-password',
    component: ResetPassword,
    exact: true,
  },
];

const otherRouters = [
  {
    path: '*',
    component: Errors,
  },
];

const Routes = (_routers = routers, routeParent) => {
  const { verifyRoutePermission } = useVerifyAccess();
  // Check xem user được phép truy cập những route nào
  const routesAccess = otherRouters.concat(_routers.filter((route) => verifyRoutePermission(route.permission)));
  return (
    <>
      {outsideRouter.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          exact={route.exact}
          errorElement={Errors}
          Component={route.component}
        />
      ))}

      <Route
        key={homePageRouter.path}
        path={homePageRouter.path}
        exact={homePageRouter.exact}
        errorElement={Errors}
        Component={homePageRouter.component}
      >
        {routesAccess.map((route) => (
          <Route
            key={route.path}
            index={route.index}
            path={`${routeParent?.path ?? ''}${route.path}`}
            exact={route.exact}
            loader={route.loader}
            errorElement={Errors}
            Component={route.component}
          >
            {route.children && route.children.length && Routes(route.children, route)}
          </Route>
        ))}
      </Route>
    </>
  );
};

export default Routes;
