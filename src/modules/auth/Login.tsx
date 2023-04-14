import { Link } from "react-router-dom";
import { paths } from "../../utils/paths";
import { Button, Form, Input } from "antd";

const Login = () => {
  return (
    <div>
      <p>
        Don't have an account? <Link to={paths.signup}>Create an account.</Link>
      </p>

      <Form layout="vertical">
        <Form.Item label="E-Mail" name="email">
          <Input type="email" required className="border" />
        </Form.Item>
        <Form.Item className="mb-3" label="Password" name="password">
          <Input.Password type="password" required />
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

