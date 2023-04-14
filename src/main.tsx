import React from "react";
import ReactDOM from "react-dom/client";
import AppRoute from "./AppRoute";
import "./index.less";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppRoute />
  </React.StrictMode>
);

