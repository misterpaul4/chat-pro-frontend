import { Button, Form, FormInstance } from "antd";
import { useEffect, useState } from "react";

const SubmitButton = ({ form }: { form: FormInstance }) => {
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
    >
      Submit
    </Button>
  );
};

export default SubmitButton;

