import { List, Space, Typography } from "antd";
import { IInbox, IThread, ThreadTypeEnum } from "../api/types";
import { capitalize } from "../../../utils/strings";
import { useDispatch, useSelector } from "react-redux";
import { setActiveThread } from "../slice/homeSlice";
import { hoverColor } from "../../../settings";
import { RootState } from "../../../store";
import { getPrivateThreadRecipient } from "../helpers";
import ContactAvatar from "../../../app/common/ContactAvatar";
import { useContext } from "react";
import { typingContext } from "../context/typingContext";
import Typing from "../../../app/common/IsTyping";

interface IProps {
  list: IInbox | undefined;
  activeThreadId?: string | undefined;
}

const SideBarBody = ({ list, activeThreadId }: IProps) => {
  const dispatch = useDispatch();
  const typingState = useContext(typingContext);

  const userId = useSelector((state: RootState) => state.user.user.id);

  const getContactInfo: (thread: IThread) => {
    avatarProps: string;
    contactInfo: string | React.ReactElement;
  } = (thread) => {
    if (thread.type === ThreadTypeEnum.Group)
      return {
        avatarProps: thread.title,
        contactInfo: thread.title,
      };

    const { firstName, lastName, email } =
      thread.type === ThreadTypeEnum.Self
        ? thread.users[0]
        : getPrivateThreadRecipient(thread.users, userId);

    return {
      avatarProps: firstName,
      contactInfo: (
        <>
          <strong>{capitalize(firstName)}</strong>
          <strong>{capitalize(lastName)}</strong>
          {`(${email})`}
        </>
      ),
    };
  };

  return (
    <List
      className="border-top border-bottom sidebar-message-container"
      dataSource={list}
      renderItem={(item: IThread) => {
        const message = item.messages[0].message;
        const { avatarProps, contactInfo } = getContactInfo(item);
        const typingClient = typingState[item.id];
        return (
          <List.Item
            className="cursor-pointer sidebar-message-item pt-3 ps-3 pe-3"
            onClick={() => dispatch(setActiveThread(item))}
            style={{
              backgroundColor: item.id === activeThreadId ? hoverColor : "",
            }}
          >
            <Space align="start">
              <ContactAvatar name={avatarProps} />
              <Space direction="vertical">
                <Typography.Paragraph ellipsis={{ rows: 2 }} className="m-0">
                  {contactInfo}
                </Typography.Paragraph>
                <Typography.Paragraph className="mb-0" ellipsis={{ rows: 2 }}>
                  {message}
                </Typography.Paragraph>
                <div>
                  {typingClient && (
                    <Typing
                      typingClient={typingClient}
                      threadType={item.type}
                      threadUsers={item.users}
                    />
                  )}
                  <em style={{ visibility: "hidden" }}>"</em>
                </div>
              </Space>
            </Space>
          </List.Item>
        );
      }}
    />
  );
};

export default SideBarBody;

