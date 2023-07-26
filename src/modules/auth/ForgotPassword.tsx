import { Button, Card, Form, Input, Result, Typography } from "antd";
import { Link } from "react-router-dom";
import { paths } from "../../utils/paths";
import { ArrowLeftOutlined } from "@ant-design/icons";

const ForgotPassword = () => {
  return (
    <div>
      <Typography.Title>Forgot Password?</Typography.Title>

      <Form layout="vertical">
        <Form.Item label="E-mail">
          <Input
            size="large"
            required
            placeholder="Please enter your email address"
          />
        </Form.Item>

        <Button disabled size="large" htmlType="submit" type="primary" block>
          Reset Password
        </Button>
      </Form>

      <Link to={paths.login} className="mt-3 d-block">
        <ArrowLeftOutlined /> Go to login
      </Link>
    </div>
  );
};

export default ForgotPassword;

