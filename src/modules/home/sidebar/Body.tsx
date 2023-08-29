import { Badge, List, Space, Typography } from "antd";
import { IInbox, IThread, IThreadMemory, ThreadTypeEnum } from "../api/types";
import { capitalize } from "../../../utils/strings";
import { useDispatch, useSelector } from "react-redux";
import { setActiveThread } from "../slice/homeSlice";
import { SETTINGS, THREAD_MEMORY, layoutPrimaryColor } from "../../../settings";
import { RootState } from "../../../store";
import { getPrivateThreadRecipient } from "../helpers";
import ContactAvatar from "../../../app/common/ContactAvatar";
import { useContext } from "react";
import { typingContext } from "../context/typingContext";
import Typing from "../../../app/common/IsTyping";
import { getLastMessageTime } from "../../../app/lib/helpers/time";
import { getMessageContent } from "../../../utils/dom";
import { useReadThreadMutation } from "../api/mutationEndpoints";
import { setLS } from "../../../app/lib/helpers/localStorage";

interface IProps {
  list: IInbox | undefined;
  activeThread?: IThread | undefined;
}

const SideBarBody = ({ list, activeThread }: IProps) => {
  const dispatch = useDispatch();
  const typingState = useContext(typingContext);

  const [readThread] = useReadThreadMutation();

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

    if (thread.type === ThreadTypeEnum.Self) {
      const props = thread.users[0];
      return {
        avatarProps: props.firstName,
        contactInfo: <strong>You</strong>,
      };
    }

    const { firstName, lastName } = getPrivateThreadRecipient(
      thread.users,
      userId
    );

    return {
      avatarProps: firstName,
      contactInfo: (
        <>
          <strong className="me-2 capitalize">{capitalize(firstName)}</strong>
          <strong className="capitalize">{capitalize(lastName)}</strong>
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
        const threadLastScrollKeys = Array.from(THREAD_MEMORY.keys());

        if (SETTINGS.maxLastScrolls === threadLastScrollKeys.length) {
          THREAD_MEMORY.delete(threadLastScrollKeys[0]);
        }

        const toSave: IThreadMemory = {
          pos: activeThreadScrollPos ?? 0,
          mSize: activeThread.messages.length,
          message: getMessageContent(),
        };

        THREAD_MEMORY.set(activeThreadId, toSave);
      }

      dispatch(setActiveThread(thread));

      setLS("activeThreadId", thread.id);

      if (thread.unreadCountByUsers[userId]) {
        readThread(thread.id);
      }
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
            className={`cursor-pointer sidebar-message-item pt-3 ps-3 pe-3 ${
              item.id === activeThreadId ? "is-active" : ""
            }`}
            onClick={() => onThreadClick(item)}
            extra={<Badge count={item.unreadCountByUsers[userId] ?? 0} />}
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

