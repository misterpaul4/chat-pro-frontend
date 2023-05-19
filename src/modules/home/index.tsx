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
import { useEffect, useReducer } from "react";
import {
  messageActionType,
  messageInitialState,
  messageReducer,
} from "./context/messageReducer";
import useSocketSubscription from "../../app/hooks/useSocketSubscription";

const { Sider, Content, Header, Footer } = Layout;

const Home = () => {
  const { user, darkMode } = useSelector((state: RootState) => state.user);

  const { data: contactList } = useGetContactsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const loading = !contactList;

  const [inbox, dispatchInbox] = useReducer(
    messageReducer,
    messageInitialState
  );
  const [request, dispatchRequest] = useReducer(
    messageReducer,
    messageInitialState
  );

  useSocketSubscription([
    {
      event: "inbox",
      handler: (data) =>
        dispatchInbox({ type: messageActionType.Add_message, payload: data }),
    },
    {
      event: "request",
      handler: (data) =>
        dispatchRequest({ type: messageActionType.Add_message, payload: data }),
    },
  ]);

  return (
    <Layout hasSider className="message-container">
      <Sider className="siderStyle">
        <div className="p-3">
          <SiderLoader
            component={
              <SideBar
                dispatchInbox={dispatchInbox}
                dispatchRequest={dispatchRequest}
                inbox={inbox}
                request={request}
              />
            }
            loading={loading}
          />
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header className="headerStyle">
          <div className="float-end">
            <HeaderProvider>
              <NewChatModal dispatchInbox={dispatchInbox} />
              <ContactListDrawer contactList={contactList} />
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

