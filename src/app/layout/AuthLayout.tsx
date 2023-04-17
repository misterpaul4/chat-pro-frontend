import { Outlet, useLocation } from "react-router-dom";
import "./authLayout.less";
import { Card, Carousel, Col, ConfigProvider, Row, Typography } from "antd";
import s1 from "../../../public/slide-1.jpg";
import s2 from "../../../public/slide-2.jpg";
import s3 from "../../../public/slide-3.jpg";
import s4 from "../../../public/slide-4.jpg";
import s5 from "../../../public/slide-5.jpg";
import { authLayoutPrimaryColor } from "../../settings";
import { paths } from "../../utils/paths";

const AuthLayout = () => {
  const path = useLocation().pathname;
  const inForgotPassword = path.includes(paths.forgotPassword);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: authLayoutPrimaryColor } }}>
      <main>
        <Row>
          <Col span={12}>
            <Card className="auth-container">
              {!inForgotPassword && (
                <Typography.Title>Welcome</Typography.Title>
              )}
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
      </main>
    </ConfigProvider>
  );
};

export default AuthLayout;

