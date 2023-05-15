import { List, Space, Typography } from "antd";
import { IInbox, IThread, ThreadTypeEnum } from "../api/types";
import { capitalize } from "../../../utils/strings";
import { useDispatch, useSelector } from "react-redux";
import { setActiveContact } from "../slice/homeSlice";
import { hoverColor } from "../../../settings";
import { RootState } from "../../../store";
import { getPrivateThreadRecipient } from "../helpers";

interface IProps {
  list: IInbox | undefined;
  activeContactId?: string | undefined;
}

const SideBarBody = ({ list, activeContactId }: IProps) => {
  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.user.user.id);

  const getContactInformation = (thread: IThread) => {
    if (thread.type === ThreadTypeEnum.Group) return thread.title;

    const { firstName, lastName, email } =
      thread.type === ThreadTypeEnum.Self
        ? thread.users[0]
        : getPrivateThreadRecipient(thread.users, userId);

    return (
      <>
        <strong>{capitalize(firstName)}</strong>
        <strong>{capitalize(lastName)}</strong>
        {`(${email})`}
      </>
    );
  };

  return (
    <List
      className="border-top border-bottom sidebar-message-container"
      dataSource={list}
      renderItem={(item: IThread) => {
        const message = item.messages[0].message;
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
                <Space>{getContactInformation(item)}</Space>
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

