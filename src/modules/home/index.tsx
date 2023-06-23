import { Layout } from "antd";
import "./index.less";
import AppHeader from "./header/AppHeader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import NewChatModal from "./components/NewChatModal";
import {
  useGetContactsQuery,
  useGetOnlineContactsQuery,
} from "./api/queryEndpoints";
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
import { IThread, ITypingResponse } from "./api/types";
import {
  setActiveThread,
  setNewMessage,
  setRequestApprovalUpdate,
  setRequestRejectionUpdate,
} from "./slice/homeSlice";
import MessageInput from "./components/MessageInput";
import { typingInitialState, typingReducer } from "./context/typingReducer";
import { typingContext } from "./context/typingContext";

const { Sider, Content, Header, Footer } = Layout;

const Home = () => {
  const { user, darkMode, activeThread, isNewThread } = useSelector(
    (state: RootState) => ({
      user: state.user.user,
      darkMode: state.user.darkMode,
      activeThread: state.app.activeThread,
      isNewThread: state.app.isNewThreadDisplay,
    })
  );

  const dispatch = useDispatch();

  const { data: contactList, refetch: refetchContacts } = useGetContactsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: onlineContacts } = useGetOnlineContactsQuery();

  const loading = !contactList || !onlineContacts;

  const [inbox, dispatchInbox] = useReducer(
    messageReducer,
    messageInitialState
  );
  const [request, dispatchRequest] = useReducer(
    messageReducer,
    messageInitialState
  );

  const [typing, dispatchIsTyping] = useReducer(
    typingReducer,
    typingInitialState
  );

  useSocketSubscription([
    // controls inbox tab
    {
      event: "inbox",
      handler: (data) => {
        dispatchInbox({ type: messageActionType.NewThread, payload: data });
        refetchContacts();
      },
    },
    // controls request tab
    {
      event: "request",
      handler: (data) =>
        dispatchRequest({ type: messageActionType.NewThread, payload: data }),
    },
    // appends new inbox message
    {
      event: "newMessage",
      handler: (data) => {
        dispatch(setNewMessage(data));
        dispatchInbox({ type: messageActionType.NewMessage, payload: data });
      },
    },
    // controls request approval for recipients
    {
      event: "approvedRequest",
      handler: (data) => {
        dispatchRequest({ type: "RemoveThread", payload: data });
        dispatchInbox({ type: "NewThread", payload: data });
        refetchContacts();
      },
    },
    // controls request approval for user
    {
      event: "approvedRequestUser",
      handler: (data: IThread) => {
        const index = inbox.findIndex((th: IThread) => th.id === data.id);
        const _data = { ...inbox[index], ...data };

        dispatch(setRequestApprovalUpdate(_data)); // if thread is currently opened by user, update content
        dispatchInbox({
          type: "ApprovedThread",
          payload: { data: _data, index },
        });
      },
    },
    // controls request rejection for recipients
    {
      event: "rejectedRequest",
      handler: (id: string) => {
        dispatchRequest({ type: "RemoveThread", payload: { id } });
        refetchContacts();
      },
    },
    // controls request  for user
    {
      event: "rejectedRequestUser",
      handler: (id: string) => {
        dispatch(setRequestRejectionUpdate(id)); // if thread is currently opened by user, update content
        dispatchInbox({ type: "RemoveThread", payload: { id } });
      },
    },
    // controls typing
    {
      event: "typing",
      handler: (data: ITypingResponse) => {
        dispatchIsTyping({ type: "Update", payload: data });
      },
    },
  ]);

  useEffect(() => {
    return () => {
      dispatch(setActiveThread(undefined));
    };
  }, []);

  return (
    <Layout hasSider className="message-container">
      <Sider className="siderStyle">
        <div className="p-3">
          <typingContext.Provider value={typing}>
            <SideBar
              loading={loading}
              dispatchInbox={dispatchInbox}
              dispatchRequest={dispatchRequest}
              inbox={inbox}
              request={request}
            />
          </typingContext.Provider>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header className="headerStyle">
          <div className="float-end">
            <HeaderProvider>
              <NewChatModal />
              <ContactListDrawer contactList={contactList} />
              <AppHeader user={user} darkMode={darkMode} />
            </HeaderProvider>
          </div>
        </Header>
        <Content className="contentStyle">
          <div className="d-flex flex-column message-skeleton">
            <ContentLoader loading={loading} />
          </div>
          <typingContext.Provider value={typing}>
            {!loading && <MessageContent onlineContacts={onlineContacts} />}
          </typingContext.Provider>
        </Content>
        <Footer className="footerStyle p-1">
          <MessageInput activeThread={activeThread} isNewThread={isNewThread} />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Home;

