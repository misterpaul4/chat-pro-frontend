import { LoadingOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Input, Result, Space, Spin, message } from "antd";
import { useState } from "react";
import {
  useEmailChangeReqMutation,
  useEmailChangeReqSubmitMutation,
} from "../api/mutationEndpoints";
import EmailVerificationCode from "../../../app/common/EmailVerificationCode";
import { useDispatch } from "react-redux";
import { setGetSelf } from "../../auth/control/userSlice";
import useApiResponseHandler from "../../../app/hooks/useApiResponseHandler";

interface IProps {
  backToProfile: () => void;
}

const EmailChange = ({ backToProfile }: IProps) => {
  const [email, setEmail] = useState<string>();
  const [verifMode, setVerifMode] = useState(false);

  const [changeReq, { isLoading: loading1 }] = useEmailChangeReqMutation();
  const [submitCode, { isLoading }] = useEmailChangeReqSubmitMutation();
  const dispatch = useDispatch();

  const apiResponseHandler = useApiResponseHandler();

  const onFinish = async (code: string) => {
    const resp: any = await submitCode({ code, email: email! });

    apiResponseHandler(resp, {
      onSuccess: {
        display: true,
        callBack: () => {
          dispatch(setGetSelf(resp.data));
          backToProfile();
        },
        message: "success",
      },
    });
  };

  const onResend = async (start: Function) => {
    if (!email) return;
    const resp: any = await changeReq({ email });

    apiResponseHandler(resp, {
      onSuccess: {
        callBack: start,
        message: "Code sent successfully",
        display: true,
      },
    });
  };

  const validateEmail = () => {
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return !emailRegex.test(email);
    }

    return true;
  };

  const onChangeReq = async () => {
    if (!email) return;
    const resp: any = await changeReq({ email });

    apiResponseHandler(resp, {
      onSuccess: { callBack: () => setVerifMode(true) },
    });
  };

  return (
    <div>
      <Result
        status="warning"
        title="You are about to change your email address"
        subTitle={
          verifMode ? `Enter the verification code sent to ${email}` : ""
        }
        extra={
          verifMode ? (
            <Spin spinning={isLoading} indicator={<LoadingOutlined />}>
              <EmailVerificationCode
                resendLoading={loading1}
                onFinish={onFinish}
                onResend={onResend}
              />
            </Spin>
          ) : (
            <Space>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                size="large"
                type="email"
                placeholder="New Email"
              />{" "}
              <Button
                disabled={validateEmail()}
                loading={loading1}
                size="large"
                icon={<SendOutlined />}
                onClick={onChangeReq}
              />
            </Space>
          )
        }
      />
    </div>
  );
};

export default EmailChange;

