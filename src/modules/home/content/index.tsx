import { useSelector } from "react-redux";
import ActionHeader from "./ActionHeader";
import { RootState } from "../../../store";
import { useEffect } from "react";
import InboxContent from "./InboxContent";
import RequestContent from "./RequestContent";

const MessageContent = () => {
  const { activeContact, activeTab } = useSelector(
    (state: RootState) => state.app
  );
  // sender ==> request tab
  // contact ==> inbox tab

  // useEffect(() => {}, [activeContact, activeTab]);

  return activeContact ? (
    <div className="w-100">
      <ActionHeader
        activeContact={activeContact["sender"] || activeContact["contact"]}
      />
      {activeContact["contact"] ? <InboxContent /> : <RequestContent />}
    </div>
  ) : null;
};

export default MessageContent;

