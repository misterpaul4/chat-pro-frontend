import { Layout, Skeleton, Space } from "antd";
import "./index.less";
import AppHeader from "./header/AppHeader";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { IBaseUser } from "../auth/control/types";
import ContactActionModal from "./components/ContactActionModal";
import { useGetContactsQuery } from "./api/queryEndpoints";

const { Sider, Content, Header, Footer } = Layout;

const Home = () => {
  const user: IBaseUser = useSelector((state: RootState) => state.user.user);

  const { data: contactList, isFetching: fetchingContacts } =
    useGetContactsQuery();

  return (
    <Layout className="message-container">
      <Sider className="siderStyle">
        <div>
          <Skeleton round avatar active className="my-5" />
          <Skeleton round avatar active className="my-5" />
          <Skeleton round avatar active className="my-5" />
        </div>
      </Sider>
      <Layout>
        <ContactActionModal />
        <Header className="headerStyle">
          <div className="float-end">
            <AppHeader user={user} />
          </div>
        </Header>
        <Content className="contentStyle">
          <div className="d-flex flex-column message-skeleton">
            <Skeleton active></Skeleton>
            <Skeleton className="flip-x" active></Skeleton>
            <Skeleton active></Skeleton>
            <Skeleton className="flip-x" active></Skeleton>
          </div>
        </Content>
        <Footer className="footerStyle"></Footer>
      </Layout>
    </Layout>
  );
};

export default Home;

