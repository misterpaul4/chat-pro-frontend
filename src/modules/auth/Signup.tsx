import { Link, useNavigate } from "react-router-dom";
import { paths } from "../../utils/paths";
import { Button, Form, Input, Spin, message } from "antd";
import { passwordRule } from "../../app/lib/helpers/form";
import { useSignupMutation } from "./api";
import { ISignUp } from "./api/types";
import { useContext, useState } from "react";
import { GoogleOutlined, LoadingOutlined } from "@ant-design/icons";
import useApiResponseHandler from "../../app/hooks/useApiResponseHandler";
import globalContext from "../../app/context/globalContext";
import useSocialAuth from "../../app/hooks/useSocialAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const [createAccount, { isLoading }] = useSignupMutation();
  const { messageApi } = useContext(globalContext);

  const apiResponseHandler = useApiResponseHandler();

  const [customLoading, setCustomLoading] = useState(false);

  const signupWithGoogle = useSocialAuth();

  const onFinish = async (values: ISignUp) => {
    const res = await createAccount(values);
    apiResponseHandler(res, {
      onSuccess: {
        callBack: () => {
          setCustomLoading(true);
          setTimeout(() => {
            navigate(paths.login, { state: values });
            messageApi.info("Login to your new account");
            setCustomLoading(false);
          }, 2000);
        },
        message: "Account created successfully",
      },
    });
  };

  return (
    <Spin indicator={<LoadingOutlined />} spinning={customLoading}>
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
      <Button size="large" className="mt-3" block icon={<GoogleOutlined />}>
        Sign up with google
      </Button>
    </Spin>
  );
};

export default SignUp;

