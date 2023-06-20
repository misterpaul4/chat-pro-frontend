import { List, Tag } from "antd";
import { IThread, IThreadScroll, ThreadTypeEnum } from "../api/types";
import MessageBox from "./MessageBox";
import { useEffect, useRef, useState } from "react";
import { resizeContentHeight } from "../constants/helpers";
import { checkIfElementVisible, inputFocus } from "../../../utils/dom";
import { THREAD_LAST_SCROLL, layoutPrimaryColor } from "../../../settings";
import { ClockCircleOutlined } from "@ant-design/icons";

interface IProps {
  thread: IThread;
  userId: string;
  isNewThread: boolean;
}

const InboxContent = ({ thread, userId, isNewThread }: IProps) => {
  const [newMessagePopUp, setNewMessagePopUp] = useState(false);
  const { type } = thread;
  const ref = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const messageLength = thread.messages.length - 1;

  const scrollTo = (pos: number) => {
    ref.current!.scrollTop = pos;
  };

  const removeNewMessageIndicator = () => {
    if (checkIfElementVisible(lastMessageRef.current!)) {
      setNewMessagePopUp(false);
      ref.current!.removeEventListener("scroll", removeNewMessageIndicator);
    }
  };

  const chatScroll = () => {
    if (ref.current) {
      if (isNewThread) {
        const savedScroll: IThreadScroll | undefined = THREAD_LAST_SCROLL.get(
          thread.id
        );
        scrollTo(
          savedScroll?.mSize === messageLength + 1
            ? savedScroll.pos
            : ref.current.scrollHeight
        );
      } else {
        const lastMessageSender = thread.messages[0].senderId;
        if (
          (lastMessageRef.current &&
            checkIfElementVisible(lastMessageRef.current, true)) ||
          lastMessageSender === userId
        ) {
          scrollTo(ref.current.scrollHeight);
        } else {
          setNewMessagePopUp(true);
          // add event listener for scroll
          // dispparear if last message in viewport
          ref.current.addEventListener("scroll", removeNewMessageIndicator);
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

  const onIndicatorClick = () => {
    if (ref.current) {
      scrollTo(ref.current.scrollHeight);
      inputFocus();
    }

    setNewMessagePopUp(false);
  };

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
          const shouldSetLastMessageRef = index === messageLength;

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

      {newMessagePopUp && (
        <Tag
          onClick={onIndicatorClick}
          style={{ backgroundColor: "white", color: layoutPrimaryColor }}
          icon={<ClockCircleOutlined />}
          className="new-message-indicator border py-2 px-3"
        >
          New message
        </Tag>
      )}
    </div>
  );
};

export default InboxContent;

