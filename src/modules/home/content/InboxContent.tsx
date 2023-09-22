import { Button, List, Tag, Typography } from "antd";
import { IMessage, IThread, ThreadTypeEnum } from "../api/types";
import MessageBox from "./MessageBox";
import { useEffect, useRef, useState } from "react";
import { resizeContentHeight } from "../constants/helpers";
import { checkIfElementVisible, inputFocus } from "../../../utils/dom";
import { layoutPrimaryColor } from "../../../settings";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { $threadMemory, setThreadMemory } from "../slice/threadMemorySlice";
import { emitReadMessage } from "../api/sockets";
import { messageActionType } from "../context/messageReducer";

interface IProps {
  thread: IThread;
  userId: string;
  isNewThread: boolean;
  threadMemory: $threadMemory;
  dispatchInbox: Function;
}

const InboxContent = ({
  thread,
  userId,
  isNewThread,
  threadMemory,
  dispatchInbox,
}: IProps) => {
  const dispatch = useDispatch();
  const [newMessagePopUp, setNewMessagePopUp] = useState(false);
  const { type } = thread;
  const ref = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const replyingTo = threadMemory[thread.id]?.replyingTo;

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

  const recentMessageInViewport = () => {
    return ref.current!.scrollHeight - ref.current!.scrollTop < 1000;
  };

  const readMessage = () => {
    emitReadMessage(thread.id, (data: { threadId: string; userId: string }) => {
      if (data) {
        dispatchInbox({
          type: messageActionType.ReadThread,
          payload: data,
        });
      }
    });
  };

  const chatScroll = () => {
    if (ref.current) {
      const lastMessageSender = thread.messages[0].senderId;
      if (
        isNewThread ||
        (lastMessageRef.current &&
          checkIfElementVisible(lastMessageRef.current, true)) ||
        lastMessageSender === userId
      ) {
        // const savedScroll: IThreadMemory | undefined = THREAD_MEMORY.get(
        //   thread.id
        // );
        // scrollTo(
        //   savedScroll?.mSize === messageLength + 1
        //     ? savedScroll.pos
        //     : ref.current.scrollHeight
        // );
        scrollTo(ref.current.scrollHeight);

        if (lastMessageSender !== userId && !isNewThread) {
          // READ MESSAGE
          readMessage();
        }
      } else {
        setNewMessagePopUp(true);
      }
    }
  };

  useEffect(() => {
    !replyingTo && resizeContentHeight();
  }, [replyingTo]);

  useEffect(() => {
    const handleScrollToButtom = () => {
      if (newMessagePopUp && recentMessageInViewport()) {
        setNewMessagePopUp(false);
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
      setNewMessagePopUp(false);

      setTimeout(() => {
        // readMessage(thread.id);
        readMessage();
      }, 1000);
    }
  };

  const onMessageReply = (message: IMessage) => {
    dispatch(
      setThreadMemory({ key: thread.id, value: { replyingTo: message } })
    );
    inputFocus();
    resizeContentHeight();
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
                userId={userId}
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

      {type === ThreadTypeEnum.Request && (
        <Typography.Title className="mt-5" level={3}>
          Request not approved
        </Typography.Title>
      )}
    </div>
  );
};

export default InboxContent;

