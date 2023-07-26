import { Button, Card, Form, Input, Result, Typography } from "antd";
import { Link } from "react-router-dom";
import { paths } from "../../utils/paths";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { passwordRule } from "../../app/lib/helpers/form";
import SubmitButton from "../../app/common/SubmitButton";

const ResetPassword = () => {
  const [form] = Form.useForm();
  return (
    <div>
      <Typography.Title>Reset Password</Typography.Title>

      <Form layout="vertical" form={form}>
        <Form.Item
          label="New Password"
          name="password"
          hasFeedback
          rules={passwordRule({ name: "Password" })}
        >
          <Input.Password type="password" required size="large" />
        </Form.Item>
        <Form.Item
          label="Verify Password"
          name="vpassword"
          hasFeedback
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject();
              },
            }),
          ]}
        >
          <Input.Password type="password" required size="large" />
        </Form.Item>
        <SubmitButton form={form} />
      </Form>

      <Link to={paths.login} className="mt-3 d-block">
        <ArrowLeftOutlined /> Go to login
      </Link>
    </div>
  );
};

export default ResetPassword;

