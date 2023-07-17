import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer, createMigrate } from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "./reducers/app";
import antConfigReducer from './reducers/antConfig'
import migrations from "./migration";

const rootReducer = combineReducers({
  app: appReducer,
  antConfig: antConfigReducer
});

const persistConfig = {
  key: "root",
  storage,
  version: 0,
  migrate: createMigrate(migrations, { debug: false }),
};

const store = createStore(
  persistReducer(persistConfig, rootReducer),
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f: any) => f
  )
);

const persistor = persistStore(store);

export default store;
export { store, persistor };
export type StoreType = typeof rootReducer
