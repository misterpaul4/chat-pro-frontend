import { Form, Input, InputRef } from "antd";
import { useEffect, useRef } from "react";
import { useSendMessageMutation } from "../api/mutationEndpoints";
import { IThread } from "../api/types";

interface IProps {
  activeThread: IThread | undefined;
}

const MessageInput = ({ activeThread }: IProps) => {
  const [form] = Form.useForm();
  const ref = useRef<InputRef>(null);
  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    activeThread && ref.current?.focus();
  }, [activeThread]);

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

  return (
    <Form form={form}>
      <Form.Item className="m-0" name="message">
        <Input.TextArea
          ref={ref}
          onPressEnter={({ shiftKey }) => !shiftKey && submitForm()}
          placeholder="Type your message..."
        />
      </Form.Item>
    </Form>
  );
};

export default MessageInput;

