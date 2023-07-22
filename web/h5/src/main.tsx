/*
 * @Author: boboan 360969885@qq.com
 * @Date: 2023-07-17 10:56:12
 * @LastEditors: boboan 360969885@qq.com
 * @LastEditTime: 2023-07-17 14:13:46
 * @FilePath: /h5/src/main.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/store'
import { AliveScope } from "@bomon/expand-router";
import { CssBaseline } from "@mui/material";
import './base.less'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AliveScope>
        <CssBaseline></CssBaseline>
        <App />
      </AliveScope>
    </PersistGate>
  </Provider>
);
