import SideBarHead from "./Head";
import {
  useGetChatRequestsQuery,
  useGetShallowInboxQuery,
} from "../api/queryEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const SideBar = ({ contactList }) => {
  const { activeTab, activeContact } = useSelector(
    (state: RootState) => state.app
  );

  const { currentData: chatRequets } = useGetChatRequestsQuery();
  const { currentData: shallowInbox } = useGetShallowInboxQuery();

  return (
    <>
      <SideBarHead activeTab={activeTab} />
      <div className="mt-2">
        {/* <SideBarBody
          activeContactId={activeContact?.id}
          activeTab={activeTab}
          list={activeTab === "inbox" ? shallowInbox || [] : chatRequets}
        /> */}
      </div>
    </>
  );
};

export default SideBar;

