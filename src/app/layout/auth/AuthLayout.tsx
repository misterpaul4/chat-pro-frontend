import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./authLayout.less";
import {
  Card,
  Carousel,
  Col,
  ConfigProvider,
  Row,
  Typography,
  message,
  notification,
  theme,
} from "antd";
import s1 from "../../../../public/slide-1.jpg";
import s2 from "../../../../public/slide-2.jpg";
import s3 from "../../../../public/slide-3.jpg";
import s4 from "../../../../public/slide-4.jpg";
import s5 from "../../../../public/slide-5.jpg";
import { paths } from "../../../utils/paths";
import { useEffect, useState } from "react";
import { clearLs, getLs } from "../../lib/helpers/localStorage";
import { useLazyGetSelfQuery } from "../../../modules/auth/api";
import { setGetSelf } from "../../../modules/auth/control/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import useThemeEffect from "../../hooks/useThemeEffect";
import globalContext from "../../context/globalContext";
import { lsKeys } from "../../lib/constants/localStorageKeys";
import useResponsive from "../../hooks/useResponsive";

const AuthLayout = () => {
  const path = useLocation().pathname;
  const withWelcome = path.includes(paths.login) || path.includes(paths.signup);

  const darkMode = useSelector((state: RootState) => state.user.darkMode);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [messageApi, mContextHolder] = message.useMessage();
  const [notificationApi, nContextHolder] = notification.useNotification();

  const [getself] = useLazyGetSelfQuery();

  useEffect(() => {
    const expired = getLs(lsKeys.SESSION_EXPIRED);
    if (expired) {
      clearLs(lsKeys.SESSION_EXPIRED);
      messageApi.error({
        content: "Session Expired. Please log in again.",
        duration: 4,
      });
    }
  }, []);

  useThemeEffect(dispatch);
  const responsive = useResponsive();

  useEffect(() => {
    const token = getLs("token");

    if (token) {
      getself().then(({ data, isSuccess }) => {
        if (isSuccess) {
          dispatch(setGetSelf(data));
          navigate(paths.home);
        }
      });
    }
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <globalContext.Provider value={{ messageApi, notificationApi, responsive }}>
        {mContextHolder}
        {nContextHolder}
        <Row>
          <Col span={12}>
            <Card className="auth-container">
              {withWelcome && <Typography.Title>Welcome</Typography.Title>}
              <Outlet />
            </Card>
          </Col>
          <Col span={12}>
            <Carousel
              // autoplay
              effect="fade"
              className="slider-container"
              dots={false}
            >
              <img src={s1} />
              <img src={s2} />
              <img src={s3} />
              <img src={s4} />
              <img src={s5} />
            </Carousel>
          </Col>
        </Row>
      </globalContext.Provider>
    </ConfigProvider>
  );
};

export default AuthLayout;

