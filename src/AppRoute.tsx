import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";

const router = createBrowserRouter(routes);

const AppRoute = () => <RouterProvider router={router} />;

export default AppRoute;
