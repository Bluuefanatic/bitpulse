import { Suspense, lazy } from 'react'
import type { ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import ProtectedRoute from '../routes/ProtectedRoute'

const Dashboard = lazy(() => import('../pages/Dashboard'))
const Login = lazy(() => import('../pages/Login'))

function withSuspense(element: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[220px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
          Loading page...
        </div>
      }
    >
      {element}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/login',
        element: withSuspense(<Login />),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: withSuspense(<Dashboard />),
          },
        ],
      },
    ],
  },
])