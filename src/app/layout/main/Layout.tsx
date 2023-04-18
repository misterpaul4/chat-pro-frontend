import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { paths } from "../../../utils/paths";
import { ConfigProvider, Spin, notification } from "antd";
import { useEffect } from "react";
import { useLazyGetSelfQuery } from "../../../modules/auth/api";
import { setGetSelf } from "../../../modules/auth/control/userSlice";
import { LoadingOutlined } from "@ant-design/icons";
import "./layout.less";
import { layoutPrimaryColor } from "../../../settings";

const Layout = () => {
  const loggedIn = useSelector((state: RootState) => state.user.auth.loggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [getself, { isLoading }] = useLazyGetSelfQuery();

  useEffect(() => {
    if (!loggedIn) {
      getself().then(({ data, isSuccess }) => {
        if (isSuccess) {
          dispatch(setGetSelf(data));
        } else {
          navigate(paths.login);
          setTimeout(() => {
            notification.destroy();
            notification.error({ message: "You have been logged out!" });
          }, 500);
        }
      });
    }
  }, [loggedIn]);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: layoutPrimaryColor } }}>
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

