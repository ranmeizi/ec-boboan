import React, { useEffect } from 'react'
import { BrowserRouter as Router } from "react-router-dom";
import routes from './routes'
import { renderRoutes } from './routes/renderRoutes'
import { store } from '@/redux/store'
import { themeChange } from '@/theme/useThemeStyle'
import config from '@/config'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN';
import { useSelector } from 'react-redux'

const style = {
  app: {
    height: '100vh'
  }
}

const configSelector = (state: any) => state.antConfig

// useStyle初始化
function themeInit() {
  const theme = store.getState().app.theme
  themeChange(theme)
  document.body.className = 'rvt-body-' + theme
}

function App() {

  const configProps = useSelector(configSelector)

  useEffect(() => {
    themeInit()
  }, [])

  return <div className='rvt-app' style={style.app}>
    <ConfigProvider locale={zhCN} {...configProps}>
      <Router basename={config.routeBasename}>
        {
          renderRoutes(routes)
        }
      </Router>
    </ConfigProvider>
  </div>
}

export default App
