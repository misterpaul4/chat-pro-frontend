import { Button, Form, InputNumber, Modal, Space, Typography } from "antd";
import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { paths } from "../../utils/paths";
import { useSubmitForgotPassMutation } from "./api";
import { apiResponseHandler } from "../../app/lib/helpers/responseHandler";
import { maskEmail } from "../../utils/strings";

const VerificationCode = () => {
  const state = useLocation().state;
  const { userId, email } = state || {};

  const navigate = useNavigate();

  const [form] = Form.useForm();
  const inputRefs: any = [];

  const [resendCode, { isLoading }] = useSubmitForgotPassMutation();

  useEffect(() => {
    if (!userId) {
      navigate(paths.login);
    }
  }, [userId]);

  // generate 6 references
  for (let i = 0; i < 6; i++) {
    const ref = useRef();
    inputRefs.push(ref);
  }

  const onResend = async () => {
    const resp: any = await resendCode(email);

    apiResponseHandler(resp, {
      onSuccess: { message: "Code sent successfully", display: true },
    });
  };

  const onFinish = (value: string) => {
    console.log("xx", value);
  };

  return (
    <div>
      <Typography.Title>Verification Code</Typography.Title>
      <em>enter the 6 digit verification code sent to {maskEmail(email)}</em>
      <Form
        form={form}
        className="mt-3"
        onValuesChange={(_, values) => {
          const _values = Object.values(values);
          if (_values.every((val) => typeof val === "number")) {
            onFinish(_values.join(""));
          }
        }}
      >
        <Space>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <React.Fragment key={index}>
              {index == 4 && (
                <div className="text-secondary" style={{ fontSize: "2rem" }}>
                  -
                </div>
              )}
              <Form.Item
                name={String(index)}
                className="verification-code-input m-0"
              >
                <InputNumber
                  onChange={(v) => {
                    if (
                      typeof v === "number" &&
                      index + 1 <= inputRefs.length
                    ) {
                      const nextInputReference = inputRefs[index];
                      nextInputReference.current.focus();
                    }
                  }}
                  ref={inputRefs[index - 1]}
                  required
                  style={{ height: 65 }}
                  onPaste={(e) => {
                    const pastedValue = e.clipboardData.getData("text/plain");
                    // check if value is an actual number
                    if (!isNaN(+pastedValue)) {
                      let j = 0;
                      for (let i = index; i < 7; i++) {
                        form.setFieldValue(`${i}`, +pastedValue[j]);
                        j++;
                      }
                    }
                  }}
                  controls={false}
                  maxLength={1}
                />
              </Form.Item>
            </React.Fragment>
          ))}
        </Space>
      </Form>

      <Typography.Paragraph className="mt-5">
        Didn't receive code?{" "}
        <Button
          loading={isLoading}
          onClick={onResend}
          className="bg-light"
          type="text"
        >
          Resend
        </Button>
      </Typography.Paragraph>

      <Link to={paths.login}>Login</Link>
    </div>
  );
};

export default VerificationCode;

