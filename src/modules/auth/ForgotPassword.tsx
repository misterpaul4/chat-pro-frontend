import { Button, Card, Form, Input, Result, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "../../utils/paths";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useSubmitForgotPassMutation } from "./api";
import { apiResponseHandler } from "../../app/lib/helpers/responseHandler";

const ForgotPassword = () => {
  const [submit, { isLoading }] = useSubmitForgotPassMutation();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const resp: any = await submit(values.email);

    apiResponseHandler(resp, {
      onSuccess: {
        callBack: () => {
          const userId = resp.data.id;
          navigate(paths.verificationCode, { state: userId });
        },
        display: true,
      },
    });
  };

  return (
    <div>
      <Typography.Title>Forgot Password?</Typography.Title>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="E-mail" name="email">
          <Input
            size="large"
            required
            placeholder="Please enter your email address"
          />
        </Form.Item>

        <Button
          size="large"
          htmlType="submit"
          type="primary"
          block
          loading={isLoading}
        >
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

