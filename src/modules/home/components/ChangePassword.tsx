import { Form, Input, Typography } from "antd";
import { passwordRule } from "../../../app/lib/helpers/form";
import SubmitButton from "../../../app/common/SubmitButton";
import { useChangePasswordMutation } from "../api/mutationEndpoints";
import useApiResponseHandler from "../../../app/hooks/useApiResponseHandler";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { setUser } from "../../auth/control/userSlice";

interface IProps {
  backToProfile: () => void;
  hasPassword?: boolean;
  dispatch: Dispatch<AnyAction>;
}

const ChangePassword = ({ backToProfile, hasPassword, dispatch }: IProps) => {
  const [form] = Form.useForm();
  const [updatePassword, { isLoading }] = useChangePasswordMutation();
  const handleResponse = useApiResponseHandler();

  const onFinish = async (values) => {
    const resp = await updatePassword(values);
    handleResponse(resp, {
      onSuccess: {
        callBack: () => {
          if (!hasPassword) {
            dispatch(setUser({ hasPassword: true }));
          }
          backToProfile();
        },
        display: true,
        message: `Password ${hasPassword ? "changed" : "added"} successfully`,
      },
    });
  };

  return (
    <div className="d-flex flex-column align-items-center mb-5">
      <Typography.Title level={3}>
        {hasPassword ? "Change" : "Add"} Password
      </Typography.Title>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        {hasPassword && (
          <Form.Item
            label="Old Password"
            name="oldPassword"
            rules={[{ required: true }]}
          >
            <Input.Password type="password" required size="large" />
          </Form.Item>
        )}
        <Form.Item
          label="New Password"
          name="newPassword"
          hasFeedback
          rules={passwordRule({ name: "New assword" })}
        >
          <Input.Password type="password" required size="large" />
        </Form.Item>
        <Form.Item
          label="Verify New Password"
          name="vPassword"
          hasFeedback
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Please confirm your new password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
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
    </div>
  );
};

export default ChangePassword;

