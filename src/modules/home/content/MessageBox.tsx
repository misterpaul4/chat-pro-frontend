import { Badge, Button, Card, Dropdown, Typography } from "antd";
import { CSSProperties } from "react";
import { getMessageTime } from "../../../app/lib/helpers/time";
import Icon, {
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
  const className = fromUser ? "bg-dark text-white" : "bg-white text-dark";

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
            className="message-reply-box bg-secondary bg-gradient text-white"
            style={{ fontSize: "0.8rem" }}
          >
            <strong className="capitalize">
              {payload.replyingTo.senderId === userId
                ? "You"
                : payload.replyingTo.sender}
            </strong>
            <Typography.Paragraph
              className="m-0 text-white"
              ellipsis={{ rows: 3 }}
            >
              {payload.replyingTo.message}
            </Typography.Paragraph>
          </Card>
        )}

        <p className="m-0">{message}</p>
        <small className="text-start text-secondary bg-light px-2">
          {getMessageTime(createdAt).toLowerCase()}
        </small>
      </Card>
    </>
  );
};

export default MessageBox;

