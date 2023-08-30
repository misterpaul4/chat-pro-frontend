import { Button, Form, InputNumber, Space, Typography } from "antd";
import useCountdownTimer from "../hooks/useCountdownTimer";
import React, { useRef } from "react";

interface IProps {
  onFinish: (code: string) => void;
  onResend: (startTimer: Function) => void;
  resendLoading: boolean;
}

const EmailVerificationCode = ({
  onFinish,
  onResend,
  resendLoading,
}: IProps) => {
  const { timer, running, start } = useCountdownTimer(120);
  const [form] = Form.useForm();

  const inputRefs: any = [];

  // generate 6 references
  for (let i = 0; i < 6; i++) {
    const ref = useRef();
    inputRefs.push(ref);
  }
  return (
    <>
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
                      const loopLength =
                        pastedValue.length < 6 ? pastedValue.length : 7;
                      for (let i = index; i < loopLength + 1; i++) {
                        form.setFieldValue(`${i}`, +pastedValue[j]);
                        j++;
                      }

                      if (pastedValue.length > 5) {
                        onFinish(pastedValue.substring(0, 6));
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

      {running ? (
        <Typography.Paragraph className="mt-5">
          You can request a new code after the countdowm
          <strong className="ms-1">{timer}</strong>
        </Typography.Paragraph>
      ) : (
        <Typography.Paragraph className="mt-5">
          Didn't receive code?{" "}
          <Button
            loading={resendLoading}
            onClick={() => onResend(start)}
            type="text"
          >
            Resend
          </Button>
        </Typography.Paragraph>
      )}
    </>
  );
};

export default EmailVerificationCode;

