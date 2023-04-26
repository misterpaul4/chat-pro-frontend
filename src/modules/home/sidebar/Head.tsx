import { Input, Space, Typography, TypographyProps } from "antd";
import { layoutPrimaryColor, transparentTextColor } from "../../../settings";
import { $tabType } from "./types";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../slice/homeSlice";

interface IProps {
  activeTab: string;
}

const SideBarHead = ({ activeTab }: IProps) => {
  const dispatch = useDispatch();
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
          onClick={() => dispatch(setActiveTab("inbox"))}
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
          onClick={() => dispatch(setActiveTab("request"))}
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

