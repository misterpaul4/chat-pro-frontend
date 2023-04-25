import { List, Space, Typography } from "antd";
import { IChatRequest, IContact } from "../api/types";
import { capitalize } from "../../../utils/strings";
import { $tabType } from "./types";

interface IProps {
  list: IContact[] | IChatRequest[];
  activeTab: $tabType;
}

const SideBarBody = ({ list, activeTab }: IProps) => {
  const key =
    activeTab === "inbox"
      ? {
          detailsKey: "contact",
          messageKey: "",
        }
      : { detailsKey: "sender", messageKey: "message" };
  return (
    <List
      className="border p-3 sidebar-message-container"
      dataSource={list}
      renderItem={(item: IContact | IChatRequest) => {
        const { firstName, lastName, email } = item[key.detailsKey];
        const message = item[key.messageKey];
        return (
          <List.Item className="cursor-pointer sidebar-message-item">
            <Space direction="vertical">
              <Typography.Paragraph ellipsis={{ rows: 2 }} className="m-0">
                <Space>
                  <strong>{capitalize(firstName)}</strong>
                  <strong>{capitalize(lastName)}</strong>
                  {`(${email})`}
                </Space>
              </Typography.Paragraph>

              <Typography.Paragraph ellipsis={{ rows: 3 }}>
                {message}
              </Typography.Paragraph>
            </Space>
          </List.Item>
        );
      }}
    />
  );
};

export default SideBarBody;

