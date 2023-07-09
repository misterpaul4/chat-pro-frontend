import { Button, Card, Dropdown, Typography } from "antd";
import { getMessageTime } from "../../../app/lib/helpers/time";
import Icon, {
  CopyOutlined,
  DownOutlined,
  EnterOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { IMessage } from "../api/types";
import { ForwardIcon } from "../../../utils/icons";

interface IProps {
  fromUser: boolean;
  withActions?: { onReply: (message: IMessage) => void };
  payload: IMessage;
  userId?: string;
}

const MessageBox = ({ fromUser, withActions, payload, userId }: IProps) => {
  const className = fromUser ? "primary-bg text-white" : "bg-white text-dark";

  const { createdAt, message } = payload;

  return (
    <>
      <Card
        className={`border-0 text-start p-3 message-width position-relative message-box ${className}`}
        bodyStyle={{ padding: 0 }}
      >
        {withActions && (
          <Dropdown
            getPopupContainer={(trigger) => trigger.parentElement!}
            menu={{
              items: [
                {
                  label: "Copy",
                  icon: <CopyOutlined />,
                  onClick: () => navigator.clipboard.writeText(message),
                },
                {
                  label: "Reply",
                  icon: <EnterOutlined />,
                  onClick: () => withActions.onReply(payload),
                },
                {
                  label: "Star",
                  icon: <StarOutlined />,
                  disabled: true,
                },
                {
                  label: "Forward",
                  icon: (
                    <Icon style={{ fontSize: 15 }} component={ForwardIcon} />
                  ),
                  disabled: true,
                },
              ] as any,
              className: "cursor-pointer mb-action-items",
              selectable: false,
            }}
            trigger={["click"]}
            className="reply-caret"
          >
            <Button
              shape="circle"
              className={className}
              type="dashed"
              icon={<DownOutlined style={{ fontSize: 12 }} />}
            />
          </Dropdown>
        )}
        {payload.replyingTo && (
          <Card
            className="message-reply-box bg-light border bg-gradient text-dark"
            style={{ fontSize: "0.8rem" }}
          >
            <strong className="capitalize">
              {payload.replyingTo.senderId === userId
                ? "You"
                : payload.replyingTo.sender}
            </strong>
            <Typography.Paragraph
              className="m-0 text-dark"
              ellipsis={{ rows: 3 }}
            >
              {payload.replyingTo.message}
            </Typography.Paragraph>
          </Card>
        )}

        <Typography.Paragraph
          ellipsis={{ rows: 10, expandable: true, symbol: "more" }}
          className={`m-0 ${className}`}
        >
          {message}
        </Typography.Paragraph>
        <small className="text-start text-muted bg-light px-2 rounded">
          {getMessageTime(createdAt).toLowerCase()}
        </small>
      </Card>
    </>
  );
};

export default MessageBox;

