import { List, Space, Typography } from "antd";
import { IInbox, IThread, IThreadScroll, ThreadTypeEnum } from "../api/types";
import { capitalize } from "../../../utils/strings";
import { useDispatch, useSelector } from "react-redux";
import { setActiveThread } from "../slice/homeSlice";
import {
  SETTINGS,
  THREAD_LAST_SCROLL,
  hoverColor,
  layoutPrimaryColor,
} from "../../../settings";
import { RootState } from "../../../store";
import { getPrivateThreadRecipient } from "../helpers";
import ContactAvatar from "../../../app/common/ContactAvatar";
import { useContext } from "react";
import { typingContext } from "../context/typingContext";
import Typing from "../../../app/common/IsTyping";
import { getLastMessageTime } from "../../../app/lib/helpers/time";

interface IProps {
  list: IInbox | undefined;
  activeThread?: IThread | undefined;
}

const SideBarBody = ({ list, activeThread }: IProps) => {
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

    const { firstName, lastName } =
      thread.type === ThreadTypeEnum.Self
        ? thread.users[0]
        : getPrivateThreadRecipient(thread.users, userId);

    return {
      avatarProps: firstName,
      contactInfo: (
        <>
          <strong className="me-2">{capitalize(firstName)}</strong>
          <strong>{capitalize(lastName)}</strong>
        </>
      ),
    };
  };

  const activeThreadId = activeThread?.id;

  const onThreadClick = (thread: IThread) => {
    if (activeThreadId !== thread.id) {
      if (activeThreadId) {
        const activeThreadScrollPos =
          document.querySelector("#message-list")?.scrollTop;
        const threadLastScrollKeys = Array.from(THREAD_LAST_SCROLL.keys());

        if (SETTINGS.maxLastScrolls === threadLastScrollKeys.length) {
          THREAD_LAST_SCROLL.delete(threadLastScrollKeys[0]);
        }

        const toSave: IThreadScroll = {
          pos: activeThreadScrollPos ?? 0,
          mSize: activeThread.messages.length,
        };

        THREAD_LAST_SCROLL.set(activeThreadId, toSave);
      }
      dispatch(setActiveThread(thread));
    }
  };

  return (
    <List
      className="border-top border-bottom sidebar-message-container"
      dataSource={list}
      renderItem={(item: IThread) => {
        const { message, createdAt } = item.messages[0] || {};
        const { avatarProps, contactInfo } = getContactInfo(item);
        const typingClient = typingState[item.id];
        return (
          <List.Item
            className="cursor-pointer sidebar-message-item pt-3 ps-3 pe-3"
            onClick={() => onThreadClick(item)}
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
                <small style={{ color: layoutPrimaryColor }}>
                  {getLastMessageTime(createdAt)}
                </small>

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

