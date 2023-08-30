import React from "react";
import ReactDOM from "react-dom/client";
import AppRoute from "./AppRoute";
import "./index.less";
import { Provider } from "react-redux";
import { store } from "./store";
import Global from "./Global";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Global />
      <AppRoute />
    </Provider>
  </React.StrictMode>
);

