import { useEffect, useState } from "react";
import SideBarHead from "./Head";
import { $tabType } from "./types";
import SideBarBody from "./Body";
import { useLazyGetChatRequestsQuery } from "../api/queryEndpoints";
import { Skeleton } from "antd";

const SideBar = ({ contactList }) => {
  const [activeTab, setActiveTab] = useState<$tabType>("request");

  const [
    getChatRequests,
    { isFetching: fetchingRequests, currentData: chatRequets },
  ] = useLazyGetChatRequestsQuery();

  useEffect(() => {
    if (activeTab === "request") {
      getChatRequests();
    }
  }, [activeTab]);

  return (
    <>
      <SideBarHead activeTab={activeTab} setActiveTab={setActiveTab} />
      <Skeleton loading={fetchingRequests} round avatar className="p-3">
        <div className="mt-2">
          <SideBarBody
            activeTab={activeTab}
            list={activeTab === "inbox" ? contactList : chatRequets}
          />
        </div>
      </Skeleton>
    </>
  );
};

export default SideBar;

