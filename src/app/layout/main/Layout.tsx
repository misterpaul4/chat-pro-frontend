import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { paths } from "../../../utils/paths";
import { ConfigProvider, Spin } from "antd";
import React, { useEffect } from "react";
import { useLazyGetSelfQuery } from "../../../modules/auth/api";
import { setGetSelf } from "../../../modules/auth/control/userSlice";
import { LoadingOutlined } from "@ant-design/icons";
import "./layout.less";
import { layoutPrimaryColor } from "../../../settings";
import { clearLs } from "../../lib/helpers/localStorage";

const Layout = () => {
  const { loggedIn, darkMode } = useSelector((state: RootState) => ({
    loggedIn: state.user.auth.loggedIn,
    darkMode: state.user.darkMode,
  }));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [getself] = useLazyGetSelfQuery();

  useEffect(() => {
    clearLs("activeThreadId");
    if (!loggedIn) {
      getself().then(({ data, isSuccess }) => {
        if (isSuccess) {
          dispatch(setGetSelf(data));
        } else {
          navigate(paths.login);
        }
      });
    }
  }, [loggedIn]);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: layoutPrimaryColor } }}>
      <main id={darkMode ? "dark-mode" : "light-mode"}>
        {loggedIn ? (
          <Outlet />
        ) : (
          <Spin
            className="layout-spin"
            indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />}
          />
        )}
      </main>
    </ConfigProvider>
  );
};

export default Layout;

