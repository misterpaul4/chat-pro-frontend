import { Button, List, Tag, Typography } from "antd";
import { IMessage, IThread, IThreadMemory, ThreadTypeEnum } from "../api/types";
import MessageBox from "./MessageBox";
import { useEffect, useRef, useState } from "react";
import { resizeContentHeight } from "../constants/helpers";
import { checkIfElementVisible, inputFocus } from "../../../utils/dom";
import { THREAD_MEMORY, layoutPrimaryColor } from "../../../settings";
import { ArrowDownOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setThreadMemory } from "../slice/threadMemorySlice";

interface IProps {
  thread: IThread;
  userId: string;
  isNewThread: boolean;
}

const InboxContent = ({ thread, userId, isNewThread }: IProps) => {
  const dispatch = useDispatch();
  const [newMessagePopUp, setNewMessagePopUp] = useState(false);
  const [scrollToBottomPopUp, setScrollToBottomPopUp] = useState(false);
  const { type } = thread;
  const ref = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const messageLength = thread.messages.length - 1;

  const scrollTo = (pos: number) => {
    ref.current!.scrollTop = pos;
  };

  const smoothScroll = (pos: number) => {
    ref.current!.scrollTo({
      top: pos,
      behavior: "smooth",
    });

    inputFocus();
  };

  const chatScroll = () => {
    if (ref.current) {
      if (isNewThread) {
        const savedScroll: IThreadMemory | undefined = THREAD_MEMORY.get(
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
          setScrollToBottomPopUp(false);
        }
      }
    }
  };

  useEffect(() => {
    resizeContentHeight();
  }, []);

  useEffect(() => {
    const handleScrollToButtom = () => {
      if (checkIfElementVisible(lastMessageRef.current!)) {
        setNewMessagePopUp(false);
        setScrollToBottomPopUp(false);
      } else {
        !newMessagePopUp && setScrollToBottomPopUp(true);
      }
    };

    ref.current?.addEventListener("scroll", handleScrollToButtom);

    return () => {
      ref.current?.removeEventListener("scroll", handleScrollToButtom);
    };
  }, [newMessagePopUp]);

  useEffect(() => {
    chatScroll();
  }, [thread]);

  const onIndicatorClick = () => {
    if (ref.current) {
      smoothScroll(ref.current.scrollHeight);
    }
  };

  const onScrollBottomClick = () => {
    smoothScroll(ref.current!.scrollHeight);
  };

  const onMessageReply = (message: IMessage) => {
    dispatch(
      setThreadMemory({ key: thread.id, value: { replyingTo: message } })
    );
  };

  return (
    <div ref={ref} id="message-list">
      <List
        dataSource={thread.messages}
        className="px-3"
        renderItem={(_, index) => {
          const threadMessage = thread.messages[messageLength - index];
          const { senderId } = threadMessage;
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
                withActions={{ onReply: onMessageReply }}
                fromUser={fromUser}
                payload={threadMessage}
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
      {scrollToBottomPopUp && (
        <Button
          onClick={onScrollBottomClick}
          className="scroll-to-bottom-btn"
          shape="circle"
          icon={<ArrowDownOutlined />}
        />
      )}

      {type === ThreadTypeEnum.Request && (
        <Typography.Title className="mt-5" level={3}>
          Request not approved
        </Typography.Title>
      )}
    </div>
  );
};

export default InboxContent;

