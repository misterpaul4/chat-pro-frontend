import { Button, ButtonProps, Form, FormInstance } from "antd";
import { useEffect, useState } from "react";

interface IProps {
  form: FormInstance;
  loading?: boolean;
}

const SubmitButton = ({ form, ...rest }: IProps) => {
  const [submittable, setSubmittable] = useState(false);

  // Watch all values
  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [values]);

  return (
    <Button
      size="large"
      htmlType="submit"
      type="primary"
      block
      disabled={!submittable}
      {...(rest || {})}
    >
      Submit
    </Button>
  );
};

export default SubmitButton;

