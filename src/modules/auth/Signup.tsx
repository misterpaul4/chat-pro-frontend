import { Link, useNavigate } from "react-router-dom";
import { paths } from "../../utils/paths";
import { Button, Form, Input, message } from "antd";
import { passwordRule } from "../../app/lib/helpers/form";
import { useSignupMutation } from "./api";
import { ISignUp } from "./api/types";
import { apiResponseHandler } from "../../app/lib/helpers/responseHandler";

const SignUp = () => {
  const navigate = useNavigate();
  const [createAccount, { isLoading }] = useSignupMutation();

  const onFinish = async (values: ISignUp) => {
    const res = await createAccount(values);
    apiResponseHandler(res, {
      onSuccess: {
        callBack: () =>
          setTimeout(() => {
            navigate(paths.login);
          }, 2000),
        message: "Account created successfully",
      },
    });
  };

  return (
    <div>
      <p>
        Already have an account?{" "}
        <Link to={paths.login}>Login to your account.</Link>
      </p>

      <Form
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={({ errorFields }) => {
          if (errorFields.find((f) => String(f.name) == "vpassword")) {
            message.warning("Passwords do not match");
          }
        }}
      >
        <Form.Item label="First Name" name="firstName">
          <Input required className="border" size="large" />
        </Form.Item>
        <Form.Item label="Last Name" name="lastName">
          <Input required className="border" size="large" />
        </Form.Item>
        <Form.Item label="E-Mail" name="email">
          <Input type="email" required className="border" size="large" />
        </Form.Item>
        <Form.Item
          label="Password"
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

        <Button
          loading={isLoading}
          size="large"
          htmlType="submit"
          type="primary"
          className="mt-3"
          block
        >
          Create Account
        </Button>
      </Form>
    </div>
  );
};

export default SignUp;

