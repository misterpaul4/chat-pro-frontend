import { Outlet } from "react-router-dom";
import "./authLayout.less";

const AuthLayout = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;

