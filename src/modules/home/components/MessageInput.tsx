import { Form, Input, InputRef } from "antd";
import { useRef } from "react";

const MessageInput = () => {
  const [form] = Form.useForm();
  const ref = useRef<InputRef>(null);

  const submitForm = async () => {
    const { message } = form.getFieldsValue();
    if (message) {
      console.log("xx", message);
      form.resetFields(["message"]);
    } else {
    }
  };

  return (
    <Form form={form} initialValues={{ meessage: "" }}>
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

