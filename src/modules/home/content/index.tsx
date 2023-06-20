import { useSelector } from "react-redux";
import ActionHeader from "./ActionHeader";
import { RootState } from "../../../store";
import InboxContent from "./InboxContent";
import RequestContent from "./RequestContent";
import { $onlineStatus, IOnlineStatus, ThreadTypeEnum } from "../api/types";
import { useReducer } from "react";
import { onlineStatusReducer } from "../context/onlineStatusReducer";
import useSocketSubscription from "../../../app/hooks/useSocketSubscription";

interface IProps {
  onlineContacts: $onlineStatus;
}

const MessageContent = ({ onlineContacts }: IProps) => {
  const { activeThread, userId, isNewThread } = useSelector(
    (state: RootState) => ({
      activeThread: state.app.activeThread,
      isNewThread: state.app.isNewThreadDisplay,
      userId: state.user.user.id,
    })
  );

  const [onlineUsers, dispatchIsOnlineStatus] = useReducer(
    onlineStatusReducer,
    onlineContacts
  );

  useSocketSubscription([
    //controls online users
    {
      event: "onlineStatus",
      handler: (data: IOnlineStatus) => {
        dispatchIsOnlineStatus({ type: "Update", payload: data });
      },
    },
  ]);

  if (!activeThread) return null;

  return (
    <div className="w-100">
      <ActionHeader
        activeThread={activeThread}
        userId={userId}
        onlineUsers={onlineUsers}
      />
      {activeThread.type === ThreadTypeEnum.Request &&
      activeThread.createdBy !== userId ? (
        <RequestContent {...activeThread} />
      ) : (
        <InboxContent
          thread={activeThread}
          isNewThread={isNewThread}
          userId={userId}
        />
      )}
    </div>
  );
};

export default MessageContent;

