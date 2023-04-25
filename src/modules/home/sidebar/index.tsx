import { useState } from "react";
import SideBarHead from "./Head";
import { $tabType } from "./types";
import SideBarBody from "./Body";

const SideBar = ({ contactList }) => {
  const [activeTab, setActiveTab] = useState<$tabType>("inbox");

  return (
    <>
      <SideBarHead activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-2">
        <SideBarBody contactList={contactList} />
      </div>
    </>
  );
};

export default SideBar;

