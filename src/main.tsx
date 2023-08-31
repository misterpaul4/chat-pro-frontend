import React from "react";
import ReactDOM from "react-dom/client";
import AppRoute from "./AppRoute";
import "./index.less";
import { Provider } from "react-redux";
import { store } from "./store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRoute />
    </Provider>
  </React.StrictMode>
);

