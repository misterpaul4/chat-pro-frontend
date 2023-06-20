import { Form, Input, InputRef } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSendMessageMutation } from "../api/mutationEndpoints";
import { IThread } from "../api/types";
import { resizeContentHeight } from "../constants/helpers";
import { emitIsTyping } from "../api/sockets";

interface IProps {
  activeThread: IThread | undefined;
}

const MessageInput = ({ activeThread }: IProps) => {
  const [form] = Form.useForm();
  const ref = useRef<InputRef>(null);
  const [sendMessage] = useSendMessageMutation();
  const message = Form.useWatch("message", form);
  const [isTyping, setIsTyping] = useState(false);

  // place cursor on input
  useEffect(() => {
    activeThread && ref.current?.focus();
  }, [activeThread]);

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

  return (
    <Form form={form}>
      <Form.Item className="m-0" name="message">
        <Input.TextArea
          onResize={resizeContentHeight}
          onChange={(e) => notifyTyping(e.target.value)}
          ref={ref}
          id="input-box"
          onPressEnter={({ shiftKey }) => !shiftKey && submitForm()}
          placeholder="Type your message..."
        />
      </Form.Item>
    </Form>
  );
};

export default MessageInput;

