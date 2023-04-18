import { Layout, Skeleton } from "antd";
import "./index.less";
import AppHeader from "./header/AppHeader";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { IUser } from "../auth/control/types";

const { Sider, Content, Header, Footer } = Layout;

const Home = () => {
  const user: IUser = useSelector((state: RootState) => state.user.user);

  return (
    <Layout className="message-container">
      <Sider className="siderStyle">
        <Skeleton round avatar active></Skeleton>
      </Sider>
      <Layout>
        <Header className="headerStyle">
          <div className="float-end">
            <AppHeader user={user} />
          </div>
        </Header>
        <Content className="contentStyle">
          <Skeleton avatar round active></Skeleton>
        </Content>
        <Footer className="footerStyle"></Footer>
      </Layout>
    </Layout>
  );
};

export default Home;

