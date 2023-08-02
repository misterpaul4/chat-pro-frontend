import { Form, Input, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { paths } from "../../utils/paths";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { passwordRule } from "../../app/lib/helpers/form";
import SubmitButton from "../../app/common/SubmitButton";
import { useEffect } from "react";
import { useResetPasswordMutation } from "./api";
import { apiResponseHandler } from "../../app/lib/helpers/responseHandler";
import { useDispatch } from "react-redux";
import { setAppState } from "./control/userSlice";

const ResetPassword = () => {
  const state = useLocation().state;
  const { code, id, email } = state || {};

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resetPass, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    if (!state) {
      navigate(paths.login);
    }
  }, [state]);

  const [form] = Form.useForm();

  if (!state) {
    return null;
  }

  const onFinish = async (values) => {
    const resp: any = await resetPass({ code, id, password: values.password });

    apiResponseHandler(resp, {
      onSuccess: {
        display: true,
        message: "Password reset successful",
        callBack: () => {
          dispatch(
            setAppState({
              auth: { token: resp.data.token },
              user: resp.data.user,
            })
          );
          navigate(paths.home);
        },
      },
    });
  };

  return (
    <div>
      <Typography.Title>Reset Password</Typography.Title>

      <Form layout="vertical" form={form} onFinish={onFinish}>
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
        <SubmitButton loading={isLoading} form={form} />
      </Form>

      <Link to={paths.login} className="mt-3 d-block">
        <ArrowLeftOutlined /> Go to login
      </Link>
    </div>
  );
};

export default ResetPassword;

