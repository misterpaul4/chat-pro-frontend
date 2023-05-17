import { useSelector } from "react-redux";
import ActionHeader from "./ActionHeader";
import { RootState } from "../../../store";
import InboxContent from "./InboxContent";
import RequestContent from "./RequestContent";
import { TEMP_USER } from "../../../utils/temp";
import { ThreadTypeEnum } from "../api/types";

const MessageContent = () => {
  const { activeContact } = useSelector((state: RootState) => state.app);

  return activeContact ? (
    <div className="w-100">
      <ActionHeader activeContact={TEMP_USER} />
      {activeContact.type === ThreadTypeEnum.Request ? (
        <RequestContent {...activeContact} />
      ) : (
        <InboxContent />
      )}
    </div>
  ) : null;
};

export default MessageContent;

