import { Layout, Typography } from "antd";
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
import { useContext, useEffect, useReducer } from "react";
import {
  messageActionType,
  messageInitialState,
  messageReducer,
} from "./context/messageReducer";
import useSocketSubscription from "../../app/hooks/useSocketSubscription";
import { IThread, ITypingResponse, ThreadTypeEnum } from "./api/types";
import {
  goToClickedThread,
  setActiveThread,
  setNewMessage,
  setRequestApprovalUpdate,
  setRequestRejectionUpdate,
} from "./slice/homeSlice";
import MessageInput from "./components/MessageInput";
import { typingInitialState, typingReducer } from "./context/typingReducer";
import { typingContext } from "./context/typingContext";
import { inputFocus } from "../../utils/dom";
import { getLs } from "../../app/lib/helpers/localStorage";
import { $tabType } from "./sidebar/types";
import globalContext from "../../app/context/globalContext";
import ContactAvatar from "../../app/common/ContactAvatar";
import { emitReadMessage } from "./api/sockets";
import usePeer from "../../app/hooks/usePeer";
import CallContext from "./context/callContext";

const { Sider, Content, Header, Footer } = Layout;

const Home = () => {
  const darkMode = useSelector((state: RootState) => state.user.darkMode);
  const user = useSelector((state: RootState) => state.user.user);
  const activeThread = useSelector(
    (state: RootState) => state.app.activeThread
  );
  const isNewThread = useSelector(
    (state: RootState) => state.app.isNewThreadDisplay
  );
  const threadMemory = useSelector((state: RootState) => state.memory);

  const dispatch = useDispatch();
  const { notificationApi } = useContext(globalContext);

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
        if (data.message.senderId !== user.id) {
          const activeTab: $tabType = getLs("activeTab");
          const activeThread = getLs("activeThreadId");

          if (data.message.threadId !== activeThread) {
            if (
              (data.type === ThreadTypeEnum.Request &&
                activeTab !== "request") ||
              (data.type !== ThreadTypeEnum.Request && activeTab !== "inbox")
            ) {
              notificationApi.info({
                icon: <ContactAvatar name={data.sender} />,
                className: "pt-0 pb-2",
                onClick() {
                  setTimeout(() => {
                    dispatchInbox({
                      type: "GetThread",
                      payload: {
                        threadId: data.message.threadId,
                        userId: user.id,
                        updateFunc: (currentThread) => {
                          dispatch(goToClickedThread(currentThread));
                          notificationApi.destroy();
                          // read thread
                          emitReadMessage(data.message.threadId, () => {});
                        },
                      },
                    });
                  }, 500);
                },
                message: (
                  <div className="ms-2">
                    <Typography.Title level={4}>{data.sender}</Typography.Title>
                    <Typography.Paragraph
                      className="m-0 "
                      ellipsis={{ rows: 3 }}
                    >
                      {data.message.message}
                    </Typography.Paragraph>
                  </div>
                ),
              });
            }
          }
        }
        dispatch(setNewMessage(data.message));
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
    // controls when message is read
    {
      event: "readMessage",
      handler: (data: { threadId: string; userId: string }) => {
        dispatchInbox({ type: messageActionType.ReadThread, payload: data });
        setTimeout(() => {
          inputFocus();
        }, 100);
      },
    },
  ]);

  const {contextHolder, ...callContextValues} = usePeer(user.id);

  useEffect(() => {
    return () => {
      dispatch(setActiveThread(undefined));
    };
  }, []);

  return (
    <CallContext.Provider value={callContextValues}>
      {contextHolder}
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
              {!loading && (
                <MessageContent
                  dispatchInbox={dispatchInbox}
                  onlineContacts={onlineContacts}
                />
              )}
            </typingContext.Provider>
          </Content>
          <Footer className="footerStyle p-1">
            <MessageInput
              dispatch={dispatch}
              dispatchInbox={dispatchInbox}
              threadMemory={threadMemory}
              activeThread={activeThread}
              isNewThread={isNewThread}
              user={user}
            />
          </Footer>
        </Layout>
      </Layout>
    </CallContext.Provider>
  );
};

export default Home;
