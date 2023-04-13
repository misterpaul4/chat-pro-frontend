import { RouteObject } from "react-router-dom";
import Layout from "./app/layout/Layout";
import Home from "./modules/home";
import AuthLayout from "./app/layout/AuthLayout";
import Login from "./modules/auth/Login";
import SignUp from "./modules/auth/Signup";

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [{ path: "/", element: <Home /> }],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "auth/login",
        element: <Login />,
      },
      {
        path: "auth/signup",
        element: <SignUp />,
      },
    ],
  },
];

