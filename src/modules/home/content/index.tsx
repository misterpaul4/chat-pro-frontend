import { useSelector } from "react-redux";
import ActionHeader from "./ActionHeader";
import { RootState } from "../../../store";
import InboxContent from "./InboxContent";
import RequestContent from "./RequestContent";

const MessageContent = () => {
  const { activeContact } = useSelector((state: RootState) => state.app);
  // sender ==> request tab
  // contact ==> inbox tab

  return activeContact ? (
    <div className="w-100">
      <ActionHeader
        activeContact={activeContact["sender"] || activeContact["contact"]}
      />
      {activeContact["contact"] ? (
        <InboxContent />
      ) : (
        <RequestContent {...activeContact} />
      )}
    </div>
  ) : null;
};

export default MessageContent;

