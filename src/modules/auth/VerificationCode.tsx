import { Form, InputNumber, Modal, Space, Typography } from "antd";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { paths } from "../../utils/paths";

const VerificationCode = () => {
  const userId = useLocation().state;
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const submitBtnRef = useRef<HTMLElement>(null);
  const inputRefs: any = [];

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

  return (
    <div>
      <Typography.Title>Verification Code</Typography.Title>

      <Form form={form}>
        <Space>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <>
              {index == 4 && (
                <div className="text-secondary" style={{ fontSize: "4rem" }}>
                  -
                </div>
              )}
              <Form.Item
                name={String(index)}
                key={index}
                className="verification-code-input m-0"
              >
                <InputNumber
                  onChange={(v) => {
                    if (typeof v === "number") {
                      if (index + 1 <= inputRefs.length) {
                        const nextInputReference = inputRefs[index];
                        nextInputReference.current.focus();
                      } else {
                        submitBtnRef.current?.focus();
                        submitBtnRef.current?.click();
                      }
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

                      submitBtnRef.current?.focus();
                    }
                  }}
                  controls={false}
                  maxLength={1}
                />
              </Form.Item>
            </>
          ))}
        </Space>
      </Form>
    </div>
  );
};

export default VerificationCode;

