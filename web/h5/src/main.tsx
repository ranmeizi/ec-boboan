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
