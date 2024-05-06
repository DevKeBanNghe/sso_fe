import { Route } from 'react-router-dom';
import HomePage from 'layouts/HomePage';
import Errors from 'layouts/ErrorsPage';
import { routers } from 'routers';
import signInRouters from 'pages/SignIn/route';
import signUpRouters from 'pages/SignUp/route';
import resetPasswordRouters from 'pages/ResetPassword/route';
import forgotPasswordRouters from 'pages/ForgotPassword/route';

const outsideRouters = [...signInRouters, ...signUpRouters, ...resetPasswordRouters, ...forgotPasswordRouters];

const otherRouters = [
  {
    path: '*',
    component: Errors,
  },
];

const Routes = (_routers = routers, routeParent) => {
  const routesAccess = otherRouters.concat(_routers);

  return (
    <>
      {outsideRouters.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          exact={route.exact ?? true}
          errorElement={Errors}
          Component={route.component}
        />
      ))}

      <Route key={'HomePage'} path={'/'} exact={true} errorElement={Errors} Component={HomePage}>
        {routesAccess.map((route) => (
          <Route
            key={route.path}
            index={route.index}
            path={`${routeParent?.path ?? ''}${route.path}`}
            exact={route.exact ?? true}
            loader={route.loader}
            errorElement={Errors}
            Component={route.component}>
            {route.children && route.children.length && Routes(route.children, route)}
          </Route>
        ))}
      </Route>
    </>
  );
};

export default Routes;
