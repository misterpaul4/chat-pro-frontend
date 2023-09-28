import { Form, Input, InputRef, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSendMessageMutation } from "../api/mutationEndpoints";
import { IMessage, IThread, IThreadMemory, ThreadTypeEnum } from "../api/types";
import { resizeContentHeight } from "../constants/helpers";
import { emitIsTyping, emitNewMessage } from "../api/sockets";
import { THREAD_MEMORY } from "../../../settings";
import { CloseOutlined, EnterOutlined } from "@ant-design/icons";
import { $threadMemory, setThreadMemory } from "../slice/threadMemorySlice";
import { capitalize } from "../../../utils/strings";
import { setNewMessage } from "../slice/homeSlice";
import { messageActionType } from "../context/messageReducer";
import { v4 } from "uuid";
import { IUser } from "../../auth/control/types";

interface IProps {
  activeThread: IThread | undefined;
  isNewThread: boolean;
  dispatch: Function;
  threadMemory: $threadMemory;
  user: IUser;
  dispatchInbox: Function;
}

const MessageInput = ({
  activeThread,
  isNewThread,
  dispatch,
  threadMemory,
  user,
  dispatchInbox,
}: IProps) => {
  const [form] = Form.useForm();
  const ref = useRef<InputRef>(null);
  const [sendMessage] = useSendMessageMutation();
  const message = Form.useWatch("message", form);
  const [isTyping, setIsTyping] = useState(false);
  const userId = user?.id;

  // place cursor on input
  useEffect(() => {
    let delay: number;
    if (activeThread) {
      if (isNewThread) {
        const unSentMessage: IThreadMemory | undefined = THREAD_MEMORY.get(
          activeThread.id
        );

        if (unSentMessage?.message) {
          form.setFieldValue("message", unSentMessage.message);
        } else {
          form.resetFields(["message"]);
        }
      }

      delay = setTimeout(() => {
        activeThread && ref.current?.focus();
      }, 200);
    }
    return () => clearTimeout(delay);
  }, [activeThread, isNewThread]);

  // notify when not typing
  useEffect(() => {
    let delay: number;
    if (message || isTyping) {
      if (isTyping) {
        delay = setTimeout(() => {
          emitIsTyping({ isTyping: false, threadId: activeThread!.id });
          setIsTyping(false);
        }, 1000);
      }
    }

    return () => clearTimeout(delay);
  }, [message, isTyping]);

  if (!activeThread) {
    return null;
  }
  const replyingTo = threadMemory[activeThread.id]?.replyingTo;

  const onReplyClose = () => {
    dispatch(
      setThreadMemory({
        key: activeThread.id,
        value: { replyingTo: undefined },
      })
    );
    ref.current?.focus();
  };

  const getReplySender = () => {
    if (replyingTo!.senderId === userId) {
      return "You";
    } else {
      const user = activeThread.users.find(
        (user) => user.id === replyingTo!.senderId
      );

      return `${capitalize(user!.firstName)} ${capitalize(user!.lastName)}`;
    }
  };

  const submitForm = async () => {
    let { message } = form.getFieldsValue();
    message = message?.trim();

    if (message) {
      const payload: IMessage = {
        message,
        id: v4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sender: user,
        senderId: userId,
        threadId: activeThread.id,
      };

      if (replyingTo) {
        payload.replyingTo = {
          ...replyingTo,
          sender: getReplySender(),
        };
      }

      dispatch(setNewMessage(payload));
      dispatchInbox({
        type: messageActionType.NewMessage,
        payload: {
          message: payload,
          unreadCountByUsers: activeThread.unreadCountByUsers ?? {},
        },
      });

      // send message with socket
      emitNewMessage(
        {
          message,
          threadId: activeThread.id,
          reply: replyingTo?.id,
          updateId: payload.id,
        },
        (data: {
          message: IMessage;
          unreadCountByUsers: IThread["unreadCountByUsers"];
          updateId: string;
        }) => {
          if (data) {
            // TODO: indicate if message was delivered
          }
        }
      );

      form.resetFields(["message"]);
      if (replyingTo) {
        onReplyClose();
      } else {
        setTimeout(() => {
          ref.current?.focus();
        }, 100);
      }
    }
  };

  const notifyTyping = (value: string) => {
    if (!isTyping && value && message) {
      setIsTyping(true);
      emitIsTyping({ isTyping: true, threadId: activeThread.id });
    }
  };

  return (
    <div className="message-input-container">
      {replyingTo && (
        <div className="px-3 py-2 border rounded mb-1 pe-4 message-reply">
          <strong className="rounded" style={{ fontSize: "1rem" }}>
            {getReplySender()}
            <EnterOutlined style={{ fontSize: "0.6rem" }} className="ms-2" />
          </strong>
          <Typography.Paragraph
            className="mb-0 rounded"
            style={{ fontSize: "0.8rem" }}
            ellipsis={{ rows: 2 }}
          >
            {replyingTo.message}
          </Typography.Paragraph>
          <CloseOutlined
            style={{
              fontSize: 12,
              top: 0,
              bottom: 0,
              margin: "auto 0",
              right: 7,
            }}
            className="position-absolute cursor-pointer"
            onClick={onReplyClose}
          />
        </div>
      )}
      <Form form={form}>
        <Form.Item className="m-0" name="message">
          <Input.TextArea
            onResize={resizeContentHeight}
            disabled={activeThread.type === ThreadTypeEnum.Request}
            onChange={(e) => notifyTyping(e.target.value)}
            ref={ref}
            id="input-box"
            onPressEnter={({ shiftKey }) => !shiftKey && submitForm()}
            placeholder="Type your message..."
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default MessageInput;

