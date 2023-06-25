import { Form, Input, InputRef, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSendMessageMutation } from "../api/mutationEndpoints";
import { IThread, IThreadMemory, ThreadTypeEnum } from "../api/types";
import { resizeContentHeight } from "../constants/helpers";
import { emitIsTyping } from "../api/sockets";
import { THREAD_MEMORY } from "../../../settings";
import { CloseOutlined } from "@ant-design/icons";
import { $threadMemory, setThreadMemory } from "../slice/threadMemorySlice";
import { capitalize } from "../../../utils/strings";

interface IProps {
  activeThread: IThread | undefined;
  isNewThread: boolean;
  dispatch: Function;
  threadMemory: $threadMemory;
  userId: string;
}

const MessageInput = ({
  activeThread,
  isNewThread,
  dispatch,
  threadMemory,
  userId,
}: IProps) => {
  const [form] = Form.useForm();
  const ref = useRef<InputRef>(null);
  const [sendMessage] = useSendMessageMutation();
  const message = Form.useWatch("message", form);
  const [isTyping, setIsTyping] = useState(false);

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

  const submitForm = async () => {
    const { message } = form.getFieldsValue();

    if (message) {
      sendMessage({ message, threadId: activeThread.id });
      form.resetFields(["message"]);
      setTimeout(() => {
        ref.current?.focus();
      }, 100);
    }
  };

  const notifyTyping = (value: string) => {
    if (!isTyping && value && message) {
      setIsTyping(true);
      emitIsTyping({ isTyping: true, threadId: activeThread.id });
    }
  };

  const onReplyClose = () => {
    dispatch(
      setThreadMemory({
        key: activeThread.id,
        value: { replyingTo: undefined },
      })
    );
    ref.current?.focus();
  };

  const replyingTo = threadMemory[activeThread.id]?.replyingTo;

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

  return (
    <>
      {replyingTo && (
        <div className="px-3 py-2 border rounded mb-1 bg-light position-relative pe-4">
          <strong className="rounded" style={{ fontSize: "1rem" }}>
            {getReplySender()}
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
    </>
  );
};

export default MessageInput;

