import SideBarHead from "./Head";
import {
  useGetInboxQuery,
  useLazyGetRequestsQuery,
} from "../api/queryEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useEffect } from "react";
import SideBarBody from "./Body";

const SideBar = () => {
  const { activeTab, activeContact } = useSelector(
    (state: RootState) => state.app
  );

  const [getChatRequests, { currentData: chatRequets }] =
    useLazyGetRequestsQuery();
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
        <SideBarBody
          activeContactId={activeContact?.id}
          list={activeTab === "inbox" ? inbox : chatRequets}
        />
      </div>
    </>
  );
};

export default SideBar;
