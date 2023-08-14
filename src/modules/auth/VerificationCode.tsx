import { Spin, Typography } from "antd";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { paths } from "../../utils/paths";
import {
  useSubmitForgotPassMutation,
  useSubmitVerificationCodeMutation,
} from "./api";
import { apiResponseHandler } from "../../app/lib/helpers/responseHandler";
import { LoadingOutlined } from "@ant-design/icons";
import EmailVerificationCode from "../../app/common/EmailVerificationCode";

const VerificationCode = () => {
  const state = useLocation().state;
  const { userId, email } = state || {};

  const navigate = useNavigate();

  const [resendCode, { isLoading }] = useSubmitForgotPassMutation();

  const [verifyCode, { isLoading: verifying }] =
    useSubmitVerificationCodeMutation();

  useEffect(() => {
    if (!state) {
      navigate(paths.login);
    }
  }, [state]);

  const onResend = async (start: Function) => {
    const resp: any = await resendCode(email);

    apiResponseHandler(resp, {
      onSuccess: {
        message: "Code sent successfully",
        display: true,
        callBack: start,
      },
    });
  };

  const onFinish = async (code: string) => {
    const resp: any = await verifyCode({ code, id: userId });

    apiResponseHandler(resp, {
      onSuccess: {
        callBack: () => {
          navigate(paths.resetPassword, { state: { id: userId, code, email } });
        },
      },
    });
  };

  if (!state) {
    return null;
  }

  return (
    <Spin indicator={<LoadingOutlined />} spinning={verifying}>
      <Typography.Title>Verification Code</Typography.Title>
      <em>enter the 6 digit verification code sent to {email}</em>

      <EmailVerificationCode
        onFinish={onFinish}
        onResend={onResend}
        resendLoading={isLoading}
      />

      <Link to={paths.login}>Login</Link>
    </Spin>
  );
};

export default VerificationCode;

