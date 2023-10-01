import { Button, Form, Input, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "../../utils/paths";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useSubmitForgotPassMutation } from "./api";
import useApiResponseHandler from "../../app/hooks/useApiResponseHandler";

const ForgotPassword = () => {
  const [submit, { isLoading }] = useSubmitForgotPassMutation();
  const navigate = useNavigate();

  const apiResponseHandler = useApiResponseHandler();

  const onFinish = async (values) => {
    const resp: any = await submit(values.email);

    apiResponseHandler(resp, {
      onSuccess: {
        callBack: () => {
          const userId = resp.data.id;
          navigate(paths.verificationCode, {
            state: { userId, email: values.email },
          });
        },
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

