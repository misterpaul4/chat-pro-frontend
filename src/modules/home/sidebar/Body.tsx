import { List, Space, Typography } from "antd";
import { $activeContact, IChatRequest, IContact } from "../api/types";
import { capitalize } from "../../../utils/strings";
import { $tabType } from "./types";
import { useDispatch } from "react-redux";
import { setActiveContact } from "../slice/homeSlice";
import { hoverColor } from "../../../settings";

interface IProps {
  list: IContact[] | IChatRequest[] | undefined;
  activeTab: $tabType;
  activeContactId?: string;
}

const SideBarBody = ({ list, activeTab, activeContactId }: IProps) => {
  const dispatch = useDispatch();
  const key =
    activeTab === "inbox"
      ? {
          detailsKey: "contact",
          messageKey: "",
        }
      : { detailsKey: "sender", messageKey: "message" };
  return (
    <List
      className="border-top border-bottom sidebar-message-container"
      dataSource={list}
      renderItem={(item: $activeContact) => {
        const { firstName, lastName, email } = item[key.detailsKey];
        const message = item[key.messageKey];
        return (
          <List.Item
            className="cursor-pointer sidebar-message-item p-3"
            onClick={() => dispatch(setActiveContact(item))}
            style={{
              backgroundColor: item.id === activeContactId ? hoverColor : "",
            }}
          >
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

