import { Layout, Skeleton, Space } from "antd";
import "./index.less";
import AppHeader from "./header/AppHeader";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { IBaseUser } from "../auth/control/types";
import NewChatModal from "./components/NewChatModal";
import { useGetContactsQuery } from "./api/queryEndpoints";
import { HeaderProvider } from "./context/headerContext";

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
        <Header className="headerStyle">
          <div className="float-end">
            <HeaderProvider>
              <NewChatModal contactList={contactList} />
              <AppHeader user={user} />
            </HeaderProvider>
          </div>
        </Header>
        <Content className="contentStyle">
          <div className="d-flex flex-column message-skeleton">
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </div>
        </Content>
        <Footer className="footerStyle"></Footer>
      </Layout>
    </Layout>
  );
};

export default Home;

