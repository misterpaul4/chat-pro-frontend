import { Badge, Input, Space, Typography, TypographyProps } from "antd";
import { layoutPrimaryColor, transparentTextColor } from "../../../settings";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../slice/homeSlice";

interface IProps {
  activeTab: string;
}

const SideBarHead = ({ activeTab }: IProps) => {
  const dispatch = useDispatch();
  const tabProps: Partial<TypographyProps["Title"]["defaultProps"]> = {
    className: "cursor-pointer m-0",
    level: 2,
  };

  return (
    <div className="p-3">
      <Space size="large">
        <Badge>
          <Typography.Title
            style={{
              color:
                activeTab === "inbox"
                  ? layoutPrimaryColor
                  : transparentTextColor,
            }}
            onClick={() => dispatch(setActiveTab("inbox"))}
            {...tabProps}
          >
            Inbox
          </Typography.Title>
        </Badge>
        <Badge>
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
        </Badge>
      </Space>

      <Input placeholder="Search..." size="large" allowClear />
    </div>
  );
};

export default SideBarHead;

