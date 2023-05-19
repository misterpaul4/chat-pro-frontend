import {
  Alert,
  Button,
  Form,
  Input,
  InputProps,
  Modal,
  Spin,
  Typography,
  notification,
} from "antd";
import { IContact } from "../api/types";
import { useContext, useState } from "react";
import headerContext from "../context/headerContext";
import { ArrowRightOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  useSendMessageMutation,
  useVerifyEmailMutation,
} from "../api/mutationEndpoints";
import { apiResponseHandler } from "../../../app/lib/helpers/responseHandler";
import { IBaseUser, IUser } from "../../auth/control/types";
import { toTitleCase } from "../../../utils/strings";
import { messageActionType } from "../context/messageReducer";

interface IProps {
  contactList: IContact[] | undefined;
  user: IBaseUser;
}

interface IVerified {
  emailProps: InputProps;
  restVisibility: "visible" | "hidden";
  alert: React.ReactElement | null;
}

const EMAIL_IS_VERIFIED: IVerified = {
  emailProps: {
    disabled: true,
  },
  restVisibility: "visible",
  alert: null,
};

const EMAIL_IS_NOT_VERIFIED: IVerified = {
  emailProps: {
    addonAfter: (
      <Button
        type="text"
        htmlType="submit"
        icon={<ArrowRightOutlined className="cursor-pointer" />}
      />
    ),
  },
  restVisibility: "hidden",
  alert: (
    <Alert
      type="info"
      closable
      showIcon
      message={
        <span>
          Click on <ArrowRightOutlined /> to verify user email
        </span>
      }
    />
  ),
};

const NewChatModal = ({ dispatchInbox }) => {
  const { newChatVisibility, onNewChatModalClose } = useContext(headerContext);
  const [recipient, setRecipient] = useState<IUser>();

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [sendChatRequest, { isLoading: sending }] = useSendMessageMutation();

  const { emailProps, restVisibility, alert }: IVerified = recipient
    ? EMAIL_IS_VERIFIED
    : EMAIL_IS_NOT_VERIFIED;

  const onClose = () => {
    onNewChatModalClose();
    setRecipient(undefined);
  };

  const onFinish = async (values) => {
    if (recipient) {
      const resp: any = await sendChatRequest({
        receiverId: recipient.id,
        inbox: {
          message: values.message,
        },
      });

      apiResponseHandler(resp, {
        onSuccess: {
          callBack: () => {
            dispatchInbox({
              type: messageActionType.Add_message,
              payload: resp.data,
            });
            onClose();
          },
          message: "Success",
        },
      });
    } else {
      // verify email
      const resp: any = await verifyEmail(values);
      apiResponseHandler(resp, {
        onSuccess: {
          callBack: () => setRecipient(resp.data),
          display: false,
        },
      });
    }
  };

  return (
    <Modal
      open={newChatVisibility}
      onCancel={onClose}
      title={<Typography.Title>New Chat</Typography.Title>}
      cancelButtonProps={{ className: "d-none" }}
      okButtonProps={{ className: "d-none" }}
      className="new-chat-modal"
      destroyOnClose
    >
      <Spin indicator={<LoadingOutlined />} spinning={isLoading}>
        <Form onFinish={onFinish}>
          <Form.Item name="email">
            <Input
              placeholder="Enter E-mail"
              size="large"
              type="email"
              required
              {...emailProps}
            />
          </Form.Item>

          {alert}

          <div
            className="message-area"
            style={{
              visibility: restVisibility,
            }}
          >
            <Form.Item name="message">
              <Input.TextArea
                autoSize={{ minRows: 5 }}
                placeholder={`Hi ${toTitleCase(recipient?.firstName)}...`}
              />
            </Form.Item>

            <Form.Item className="d-flex justify-content-end mb-0">
              <Button type="primary" htmlType="submit" loading={sending}>
                Send
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default NewChatModal;

