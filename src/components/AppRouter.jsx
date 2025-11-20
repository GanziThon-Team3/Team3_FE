import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/home/entry/HomePage'
import UploadPage from '../pages/upload/entry/UploadPage'
import ResultPage from '../pages/result/entry/ResultPage'
import RootLayout from './Layout/Root-layout'
import LoadingPage from '../pages/loading/entry/LoadingPage'
import TestPage from '../pages/result/entry/TestPage'

export const AppRouter = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    path: '/',
    element: <RootLayout />,
    // errorElement: 나중에 에러페이지 만들기
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
        path: 'test',
        element: <TestPage />,
      },
    ],
  },
])

export default AppRouter
