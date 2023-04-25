import { Input, Space, Typography, TypographyProps } from "antd";
import { layoutPrimaryColor, transparentTextColor } from "../../../settings";
import { IContact } from "../api/types";
import { $tabType } from "./types";

interface IProps {
  activeTab: string;
  setActiveTab: (activeTab: $tabType) => void;
}

const SideBarHead = ({ activeTab, setActiveTab }: IProps) => {
  const tabProps: Partial<TypographyProps["Title"]["defaultProps"]> = {
    className: "cursor-pointer",
    level: 2,
  };
  return (
    <div className="p-3">
      <Space size="large">
        <Typography.Title
          style={{
            color:
              activeTab === "inbox" ? layoutPrimaryColor : transparentTextColor,
          }}
          onClick={() => setActiveTab("inbox")}
          {...tabProps}
        >
          Inbox
        </Typography.Title>
        <Typography.Title
          style={{
            color:
              activeTab === "request"
                ? layoutPrimaryColor
                : transparentTextColor,
          }}
          onClick={() => setActiveTab("request")}
          {...tabProps}
        >
          Requests
        </Typography.Title>
      </Space>

      <Input placeholder="Search..." size="large" allowClear />
    </div>
  );
};

export default SideBarHead;

