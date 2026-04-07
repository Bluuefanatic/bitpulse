import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import ProtectedRoute from '../routes/ProtectedRoute'

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
])