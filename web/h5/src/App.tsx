import React, { useEffect } from 'react'
import vhCheck from 'vh-check'
import { store } from '@/redux/store'
import { themeChange } from '@/theme/useThemeStyle'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "./routes";

const router = createBrowserRouter(routes);

vhCheck()

// useStyle初始化
function themeInit() {
  const theme = store.getState().app.theme
  themeChange(theme)
  document.body.className = 'rvt-body-' + theme
}

function App() {
  useEffect(() => {
    themeInit()
  }, [])

  return <div className='rvt-app'>
    <RouterProvider router={router} />;
  </div>
}

export default App
