import { useSelector } from "react-redux";
import ActionHeader from "./ActionHeader";
import { RootState } from "../../../store";
import InboxContent from "./InboxContent";
import RequestContent from "./RequestContent";
import { ThreadTypeEnum } from "../api/types";

const MessageContent = () => {
  const { activeThread, userId } = useSelector((state: RootState) => ({
    activeThread: state.app.activeThread,
    userId: state.user.user.id,
  }));

  if (!activeThread) return null;

  return (
    <div className="w-100">
      <ActionHeader activeThread={activeThread} userId={userId} />
      {activeThread.type === ThreadTypeEnum.Request &&
      activeThread.createdBy !== userId ? (
        <RequestContent {...activeThread} />
      ) : (
        <InboxContent />
      )}
    </div>
  );
};

export default MessageContent;

