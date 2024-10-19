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
  onlineContacts: string[];
  dispatchInbox: Function;
}

const MessageContent = ({ onlineContacts, dispatchInbox }: IProps) => {
  const activeThread = useSelector(
    (state: RootState) => state.app.activeThread
  );
  const isNewThread = useSelector(
    (state: RootState) => state.app.isNewThreadDisplay
  );
  const threadMemory = useSelector((state: RootState) => state.memory);
  const {id: userId, firstName, lastName} = useSelector((state: RootState) => state.user.user);

  const [onlineUsers, dispatchIsOnlineStatus] = useReducer(
    onlineStatusReducer,
    onlineContacts.reduce((obj, item) => ((obj[item] = true), obj), {})
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
        userName={firstName + " " +lastName}
      />
      {activeThread.type === ThreadTypeEnum.Request &&
      activeThread.createdBy !== userId ? (
        <RequestContent {...activeThread} />
      ) : (
        <InboxContent
          dispatchInbox={dispatchInbox}
          thread={activeThread}
          isNewThread={isNewThread}
          userId={userId}
          threadMemory={threadMemory}
        />
      )}
    </div>
  );
};

export default MessageContent;

