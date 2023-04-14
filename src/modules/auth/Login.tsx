import { Link } from "react-router-dom";
import { paths } from "../../utils/paths";
import { Button, Form, Input } from "antd";

const Login = () => {
  const onFinish = (values) => {};

  return (
    <div>
      <p>
        Don't have an account? <Link to={paths.signup}>Create an account.</Link>
      </p>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="E-Mail" name="email">
          <Input type="email" required className="border" size="large" />
        </Form.Item>
        <Form.Item className="mb-3" label="Password" name="password">
          <Input.Password type="password" required size="large" />
        </Form.Item>

        <Link className="float-end" to={paths.forgotPassword} replace>
          Forgot Password
        </Link>

        <Button
          size="large"
          className="mt-5"
          htmlType="submit"
          type="primary"
          block
        >
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;

