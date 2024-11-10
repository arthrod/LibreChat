import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import {
  Login,
  Registration,
  RequestPasswordReset,
  ResetPassword,
  VerifyEmail,
  ApiErrorWatcher,
} from '~/components/Auth';
import { AuthContextProvider } from '~/hooks/AuthContext';
import StartupLayout from './Layouts/Startup';
import LoginLayout from './Layouts/Login';
import dashboardRoutes from './Dashboard';
import ShareRoute from './ShareRoute';
import ChatRoute from './ChatRoute';
import Search from './Search';
import Root from './Root';
import LandingPage from './LandingPage';

const AuthLayout = () => (
  <AuthContextProvider>
    <Outlet />
    <ApiErrorWatcher />
  </AuthContextProvider>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    index: true,
  },
  {
    path: 'share/:shareId',
    element: <ShareRoute />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        element: <StartupLayout />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <Registration />,
          },
          {
            path: 'forgot-password',
            element: <RequestPasswordReset />,
          },
          {
            path: 'reset-password',
            element: <ResetPassword />,
          },
        ],
      },
      {
        path: 'verify',
        element: <VerifyEmail />,
      },
      {
        element: <Root />,
        children: [
          {
            path: 'c/:conversationId?',
            element: <ChatRoute />,
          },
          {
            path: 'search',
            element: <Search />,
          },
        ],
      },
    ],
  },
]);
