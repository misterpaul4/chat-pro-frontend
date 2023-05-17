import SideBarHead from "./Head";
import {
  useLazyGetInboxQuery,
  useLazyGetRequestsQuery,
} from "../api/queryEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useEffect } from "react";
import SideBarBody from "./Body";

const SideBar = () => {
  const { activeTab, activeContact, userId } = useSelector(
    (state: RootState) => ({
      activeTab: state.app.activeTab,
      activeContact: state.app.activeContact,
      userId: state.user.user.id,
    })
  );

  const [getChatRequests, { currentData: chatRequets }] =
    useLazyGetRequestsQuery();
  const [getInbox, { currentData: inbox }] = useLazyGetInboxQuery();

  useEffect(() => {
    if (activeTab === "request" && !chatRequets) {
      getChatRequests(userId);
    }

    if (activeTab === "inbox" && !inbox) {
      getInbox(userId);
    }
  }, [activeTab, chatRequets, inbox]);

  return (
    <>
      <SideBarHead activeTab={activeTab} />
      <div className="mt-2">
        <SideBarBody
          activeContactId={activeContact?.id}
          list={activeTab === "inbox" ? inbox : chatRequets}
        />
      </div>
    </>
  );
};

export default SideBar;

