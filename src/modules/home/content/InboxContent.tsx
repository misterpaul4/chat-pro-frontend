import { List } from "antd";
import { IThread, IThreadScroll, ThreadTypeEnum } from "../api/types";
import MessageBox from "./MessageBox";
import { useEffect, useRef } from "react";
import { resizeContentHeight } from "../constants/helpers";
import { checkIfElementVisible } from "../../../utils/dom";
import { THREAD_LAST_SCROLL } from "../../../settings";

interface IProps {
  thread: IThread;
  userId: string;
  isNewThread: boolean;
}

const InboxContent = ({ thread, userId, isNewThread }: IProps) => {
  const { type } = thread;
  const ref = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const messageLength = thread.messages.length - 1;

  const chatScroll = () => {
    if (ref.current) {
      if (isNewThread) {
        const savedScroll: IThreadScroll | undefined = THREAD_LAST_SCROLL.get(
          thread.id
        );
        ref.current.scrollTop =
          savedScroll?.mSize === messageLength + 1
            ? savedScroll.pos
            : ref.current.scrollHeight;
      } else {
        if (
          lastMessageRef.current &&
          checkIfElementVisible(lastMessageRef.current, true)
        ) {
          ref.current.scrollTop = ref.current.scrollHeight;
        } else {
          // show pop up
        }
      }
    }
  };

  useEffect(() => {
    resizeContentHeight();
  }, []);

  useEffect(() => {
    chatScroll();
  }, [thread]);

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

          let shouldSetLastMessageRef = false;

          if (messageLength - 1 > -1) {
            shouldSetLastMessageRef = index === messageLength - 1;
          } else {
            shouldSetLastMessageRef = index === messageLength;
          }

          return (
            <List.Item
              ref={shouldSetLastMessageRef ? lastMessageRef : undefined}
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

