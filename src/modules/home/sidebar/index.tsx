import { useEffect } from "react";
import SideBarHead from "./Head";
import SideBarBody from "./Body";
import {
  useLazyGetAllInboxQuery,
  useLazyGetChatRequestsQuery,
  useLazyGetShallowInboxQuery,
} from "../api/queryEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const SideBar = ({ contactList }) => {
  const { activeTab, activeContact } = useSelector(
    (state: RootState) => state.app
  );

  const [getChatRequests, { currentData: chatRequets }] =
    useLazyGetChatRequestsQuery();

  const [getInbox, { currentData: inbox }] = useLazyGetAllInboxQuery();

  useEffect(() => {
    if (activeTab === "request") {
      getChatRequests();
    } else {
      getInbox();
    }
  }, [activeTab]);

  return (
    <>
      <SideBarHead activeTab={activeTab} />
      <div className="mt-2">
        <SideBarBody
          activeContactId={activeContact?.id}
          activeTab={activeTab}
          list={activeTab === "inbox" ? inbox?.data || [] : chatRequets}
        />
      </div>
    </>
  );
};

export default SideBar;

