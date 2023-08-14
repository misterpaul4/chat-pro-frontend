import { SendOutlined } from "@ant-design/icons";
import { Button, Input, Result, Space } from "antd";
import { useState } from "react";
import { useEmailChangeReqMutation } from "../api/mutationEndpoints";
import { apiResponseHandler } from "../../../app/lib/helpers/responseHandler";

interface IProps {}

const EmailChange = ({}: IProps) => {
  const [email, setEmail] = useState<string>();
  const [verifMode, setVerifMode] = useState(false);

  const [changeReq, { isLoading: loading1 }] = useEmailChangeReqMutation();

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
        subTitle={verifMode ? "Enter the verification code sent to you" : ""}
        extra={
          verifMode ? (
            <></>
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

