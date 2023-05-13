import { Layout } from "antd";
import "./index.less";
import AppHeader from "./header/AppHeader";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import NewChatModal from "./components/NewChatModal";
import { useGetContactsQuery } from "./api/queryEndpoints";
import { HeaderProvider } from "./context/headerContext";
import SideBar from "./sidebar";
import { ContentLoader, SiderLoader } from "./components/Loaders";
import MessageContent from "./content";
import ContactListDrawer from "./components/ContactListDrawer";
import BlockedUsersDrawer from "./components/BlockedUsersDrawer";

const { Sider, Content, Header, Footer } = Layout;

const Home = () => {
  const { user, darkMode } = useSelector((state: RootState) => state.user);

  const { data: contactList, isFetching: fetchingContacts } =
    useGetContactsQuery(undefined, { refetchOnMountOrArgChange: true });

  const loading = fetchingContacts;

  return (
    <Layout hasSider className="message-container">
      <Sider className="siderStyle">
        <div className="p-3">
          <SiderLoader component={<SideBar />} loading={!contactList} />
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header className="headerStyle">
          <div className="float-end">
            <HeaderProvider>
              <NewChatModal user={user} contactList={contactList} />
              <ContactListDrawer contactList={contactList} />
              <BlockedUsersDrawer contactList={contactList} />
              <AppHeader user={user} darkMode={darkMode} />
            </HeaderProvider>
          </div>
        </Header>
        <Content className="contentStyle">
          <div className="d-flex flex-column message-skeleton">
            <ContentLoader loading={loading} />
          </div>
          {!loading && <MessageContent />}
        </Content>
        <Footer className="footerStyle"></Footer>
      </Layout>
    </Layout>
  );
};

export default Home;

