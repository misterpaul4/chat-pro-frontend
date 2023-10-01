import SideBarHead from "./Head";
import {
  useLazyGetInboxQuery,
  useLazyGetRequestsQuery,
} from "../api/queryEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useEffect } from "react";
import SideBarBody from "./Body";
import { messageActionType } from "../context/messageReducer";
import { SiderLoader } from "../components/Loaders";

const SideBar = ({
  dispatchInbox,
  dispatchRequest,
  inbox,
  request,
  loading,
}) => {
  const { activeTab, activeThread, userId } = useSelector(
    (state: RootState) => ({
      activeTab: state.app.activeTab,
      activeThread: state.app.activeThread,
      userId: state.user.user.id,
    })
  );

  const [getChatRequests, { isFetching: requestsFetching }] =
    useLazyGetRequestsQuery();
  const [getInbox, { isFetching: inboxFetching }] = useLazyGetInboxQuery();

  const initializeInbox = async () => {
    const { data } = await getInbox(userId);
    dispatchInbox({ type: messageActionType.Initialize, payload: data });
  };

  const initializeRequest = async () => {
    const { data } = await getChatRequests(userId);
    dispatchRequest({ type: messageActionType.Initialize, payload: data });
  };

  useEffect(() => {
    initializeInbox();
    initializeRequest();
  }, []);

  const hasUnreadInbox = inbox?.some(
    (inb) => inb.unreadCountByUsers?.[userId] > 0
  );

  const hasUnreadRequest = request?.some(
    (inb) => inb.unreadCountByUsers?.[userId] > 0
  );

  return (
    <SiderLoader
      loading={loading || requestsFetching || inboxFetching}
      component={
        <>
          <SideBarHead
            activeTab={activeTab}
            hasUnreadInbox={hasUnreadInbox}
            hasUnreadRequest={hasUnreadRequest}
          />
          <div className="mt-2">
            <SideBarBody
              dispatchInbox={dispatchInbox}
              dispatchRequest={dispatchRequest}
              activeThread={activeThread}
              list={activeTab === "inbox" ? inbox : request}
            />
          </div>
        </>
      }
    />
  );
};

export default SideBar;

