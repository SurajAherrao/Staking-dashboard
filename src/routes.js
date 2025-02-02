import React, { Suspense, Fragment, lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import StakeLayout from './layouts/StakeLayout';
// import MainLayout from './layouts/MainLayout';
// import HomeView from './views/home/HomeView';
import LoadingScreen from './components/LoadingScreen';
import DashboardStakingStatsView from './views/reports/DashboardStakingStatsView';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={props => (
              <Layout>
                {route.routes ? renderRoutes(route.routes) : <Component {...props} />}
              </Layout>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes = [
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('./views/errors/NotFoundView')),
  },
  {
    path: '/app',
    layout: StakeLayout,
    routes: [
      {
        exact: true,
        path: '/app/stake',
        component: lazy(() => import('./views/stake/index')),
      },
      {
        exact: true,
        path: '/app/withdrawStake',
        component: lazy(() => import('./views/withdrawStake/index')),
      },
      // {
      //   exact: true,
      //   path: '/app/stakeRewards',
      //   component: lazy(() => import('./views/stakeRewards')),
      // },
      {
        exact: true,
        path: '/app/withdrawRewards',
        component: lazy(() => import('./views/withdrawRewards/index')),
      },
      {
        exact: true,
        path: '/app/leaderboard',
        component: lazy(() => import('./views/leaderboard/index')),
      },
      {
        exact: true,
        path: '/app/staking-stats',
        component: lazy(() => import('./views/reports/DashboardStakingStatsView/index')),
      },
      {
        exact: true,
        path: '/app',
        component: () => <Redirect to="./views/stake" />,
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
  {
    path: '*',
    layout: StakeLayout,
    routes: [
      {
        exact: true,
        path: '/',
        component: DashboardStakingStatsView,
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
];

export default routes;
