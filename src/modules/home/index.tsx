import { Layout, Skeleton, Space } from "antd";
import "./index.less";
import AppHeader from "./header/AppHeader";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { IBaseUser } from "../auth/control/types";
import NewChatModal from "./components/NewChatModal";
import { useGetContactsQuery } from "./api/queryEndpoints";
import { HeaderProvider } from "./context/headerContext";
import SideBar from "./sidebar";

const { Sider, Content, Header, Footer } = Layout;

const Home = () => {
  const { user, darkMode } = useSelector((state: RootState) => state.user);

  const { data: contactList, isFetching: fetchingContacts } =
    useGetContactsQuery(undefined, { refetchOnMountOrArgChange: true });

  return (
    <Layout hasSider className="message-container">
      <Sider className="siderStyle">
        <div>
          <Skeleton
            round
            avatar
            active
            className="my-5"
            loading={fetchingContacts}
          >
            <SideBar contactList={contactList} />
          </Skeleton>
          <Skeleton
            round
            avatar
            active
            className="my-5"
            loading={fetchingContacts}
          />
          <Skeleton
            round
            avatar
            active
            className="my-5"
            loading={fetchingContacts}
          />
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header className="headerStyle">
          <div className="float-end">
            <HeaderProvider>
              <NewChatModal user={user} contactList={contactList} />
              <AppHeader user={user} darkMode={darkMode} />
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

