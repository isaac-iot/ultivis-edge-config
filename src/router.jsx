import { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import { UltivisDeviceProvider, MenuBar, ContextDashboard, StaticDashboard, NotFound } from '@ultivis/library';

import Text from './Text';

const Main = lazy(() => import('./Main'));
const Groups = lazy(() => import('./Groups'));
const Network = lazy(() => import('./components/network/Network'));
const TimeSync = lazy(() => import('./components/timesync/TimeSync.jsx'));
const TedgeConfig = lazy(() => import('./components/tedge/TedgeConfig'));
const TedgeServices = lazy(() => import('./components/tedge/TedgeServices'));
export const router = createHashRouter([
  {
    element: (
      <UltivisDeviceProvider>
        <Main />
      </UltivisDeviceProvider>
    ),
    children: [
      {
        path: '/',
        element: (
          <>
            <MenuBar />
            <StaticDashboard
              widgets={[
                {
                  title: `CCTV #4`,
                  content: <Text key="camera_d" text="Hello Widget" />,
                  i: 'd',
                  x: 2,
                  y: 2,
                  w: 10,
                  h: 10,
                },
              ]}
              widgetMargin={24}
            />
          </>
        ),
      },
      {
        path: '/network',
        element: <Network />,
      },
      {
        path: '/timesync',
        element: <TimeSync />,
      },
      {
        path: '/tedge',
        element: <TedgeConfig />,
      },
      {
        path: '/tedgeservices',
        element: <TedgeServices />,
      },
      {
        path: '/group/:groupId',
        element: <Groups />,
        children: [
          {
            path: 'dashboard/:dashboardId',
            element: <ContextDashboard />,
          },
        ],
      },
      {
        path: 'device/:deviceId',
        element: <Groups />,
        children: [
          {
            path: 'dashboard/:dashboardId',
            element: <ContextDashboard />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
