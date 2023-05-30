import { List } from "antd";
import { IThread, ThreadTypeEnum } from "../api/types";
import MessageBox from "./MessageBox";
import { useEffect, useRef } from "react";
import { resizeContentHeight } from "../constants/helpers";

interface IProps {
  thread: IThread;
  userId: string;
}

const InboxContent = ({ thread, userId }: IProps) => {
  const { type } = thread;
  const ref = useRef<HTMLDivElement>(null);

  const chatScroll = () => {
    if (ref?.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
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
    <>Request not approved</>
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

