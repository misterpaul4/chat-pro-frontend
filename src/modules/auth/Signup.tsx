import { Link } from "react-router-dom";
import { paths } from "../../utils/paths";
import { Button, Form, Input } from "antd";

const SignUp = () => {
  return (
    <div>
      <p>
        Already have an account?{" "}
        <Link to={paths.login}>Login to your account.</Link>
      </p>

      <Form layout="vertical">
        <Form.Item label="First Name" name="firstName">
          <Input required className="border" />
        </Form.Item>
        <Form.Item label="Last Name" name="lastName">
          <Input required className="border" />
        </Form.Item>
        <Form.Item label="E-Mail" name="email">
          <Input type="email" required className="border" />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password type="password" required />
        </Form.Item>
        <Form.Item label="Verify Password" name="vpassword">
          <Input.Password type="password" required />
        </Form.Item>

        <Button
          size="large"
          htmlType="submit"
          type="primary"
          className="mt-3"
          block
        >
          Login
        </Button>
      </Form>
    </div>
  );
};

export default SignUp;

