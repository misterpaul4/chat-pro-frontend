import SideBarHead from "./Head";
import {
  useGetChatRequestsQuery,
  useGetInboxQuery,
  useLazyGetChatRequestsQuery,
} from "../api/queryEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useEffect } from "react";
import SideBarInboxBody from "./Body/InboxBody";
import SideBarRequestBody from "./Body/RequestBody";

const SideBar = () => {
  const { activeTab, activeContact } = useSelector(
    (state: RootState) => state.app
  );

  const [getChatRequests, { currentData: chatRequets }] =
    useLazyGetChatRequestsQuery();
  const { currentData: inbox } = useGetInboxQuery();

  useEffect(() => {
    if (activeTab === "request" && !chatRequets) {
      getChatRequests();
    }
  }, [activeTab, chatRequets]);

  return (
    <>
      <SideBarHead activeTab={activeTab} />
      <div className="mt-2">
        {activeTab === "inbox" ? (
          <SideBarInboxBody activeContactId={activeContact?.id} list={inbox} />
        ) : (
          <SideBarRequestBody activeContactId="sdasda" list={[]} />
        )}
      </div>
    </>
  );
};

export default SideBar;

