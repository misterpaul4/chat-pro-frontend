import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { paths } from "../../../utils/paths";
import { ConfigProvider, Spin, theme } from "antd";
import { useEffect } from "react";
import { useLazyGetSelfQuery } from "../../../modules/auth/api";
import {
  setGetSelf,
  toggleDarkMode,
} from "../../../modules/auth/control/userSlice";
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
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.style.setProperty("color-scheme", "light dark");
      dispatch(toggleDarkMode(e.matches));
    };

    dispatch(toggleDarkMode(mediaQuery.matches));

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

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
    <ConfigProvider
      theme={{
        token: { colorPrimary: layoutPrimaryColor },
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <main>
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

