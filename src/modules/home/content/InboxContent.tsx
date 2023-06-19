import { List } from "antd";
import { IThread, ThreadTypeEnum } from "../api/types";
import MessageBox from "./MessageBox";
import { useEffect, useRef } from "react";
import { resizeContentHeight } from "../constants/helpers";
import { checkIfElementVisible } from "../../../utils/dom";

interface IProps {
  thread: IThread;
  userId: string;
}

const InboxContent = ({ thread, userId }: IProps) => {
  const { type } = thread;
  const ref = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const chatScroll = () => {
    if (ref.current && lastMessageRef.current) {
      // scroll if last message is in viewport or if it's initial chat scroll
      if (
        !ref.current.scrollTop ||
        checkIfElementVisible(lastMessageRef.current, true)
      ) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    resizeContentHeight();
  }, []);

  useEffect(() => {
    chatScroll();
  }, [thread]);

  const messageLength = thread.messages.length - 1;

  return type === ThreadTypeEnum.Request ? (
    <span>Request is pending approval</span>
  ) : (
    <div ref={ref} id="message-list">
      <List
        dataSource={thread.messages}
        className="px-3"
        renderItem={(_, index) => {
          const { message, createdAt, senderId } =
            thread.messages[messageLength - index];
          const fromUser = senderId === userId;

          return (
            <List.Item
              ref={index === messageLength - 1 ? lastMessageRef : undefined}
              className={`border-0 py-1 justify-content-${
                fromUser ? "end" : "start"
              }`}
            >
              <MessageBox
                createdAt={createdAt}
                message={message}
                fromUser={fromUser}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default InboxContent;

