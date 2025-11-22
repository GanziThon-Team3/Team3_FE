import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/home/entry/HomePage'
import UploadPage from '../pages/upload/entry/UploadPage'
import ResultPage from '../pages/result/entry/ResultPage'
import RootLayout from './Layout/Root-layout'
import LoadingPage from '../pages/loading/entry/LoadingPage'
import NotFoundPage from '../pages/notfound/NotFoundPage'

export const AppRouter = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'upload',
        element: <UploadPage />,
      },
      {
        path: 'result',
        element: <ResultPage />,
      },
      {
        path: 'loading',
        element: <LoadingPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

export default AppRouter
