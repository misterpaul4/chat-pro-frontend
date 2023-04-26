import { useEffect } from "react";
import SideBarHead from "./Head";
import SideBarBody from "./Body";
import { useLazyGetChatRequestsQuery } from "../api/queryEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const SideBar = ({ contactList }) => {
  const { activeTab, activeContact } = useSelector(
    (state: RootState) => state.app
  );

  const [getChatRequests, { currentData: chatRequets }] =
    useLazyGetChatRequestsQuery();

  useEffect(() => {
    if (activeTab === "request") {
      getChatRequests();
    }
  }, [activeTab]);

  return (
    <>
      <SideBarHead activeTab={activeTab} />
      <div className="mt-2">
        <SideBarBody
          activeContactId={activeContact?.id}
          activeTab={activeTab}
          list={activeTab === "inbox" ? contactList : chatRequets}
        />
      </div>
    </>
  );
};

export default SideBar;

