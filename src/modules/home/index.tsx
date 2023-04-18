import { Layout, Skeleton } from "antd";
import "./index.less";

const { Sider, Content, Header, Footer } = Layout;

const Home = () => {
  return (
    <Layout className="message-container">
      <Sider className="siderStyle">
        <Skeleton round avatar active></Skeleton>
      </Sider>
      <Layout>
        <Header className="headerStyle"></Header>
        <Content className="contentStyle">
          <Skeleton avatar round active></Skeleton>
        </Content>
        <Footer className="footerStyle"></Footer>
      </Layout>
    </Layout>
  );
};

export default Home;

