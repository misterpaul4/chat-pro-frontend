import { Button, Card, Dropdown, Typography } from "antd";
import { getMessageTime } from "../../../app/lib/helpers/time";
import Icon, {
  CopyOutlined,
  DownOutlined,
  EnterOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import { IMessage } from "../api/types";
import { ForwardIcon } from "../../../utils/icons";
import ContactAvatar from "../../../app/common/ContactAvatar";
import { layoutPrimaryColor } from "../../../settings";

interface IProps {
  fromUser: boolean;
  withActions?: { onReply: (message: IMessage) => void };
  payload: IMessage;
  userId?: string;
  senderName?: string;
  starredBy?: string; // concatinated user ids
  onStarMessage?: (messageId: string, shouldStar: boolean) => void;
}

const MessageBox = ({
  fromUser,
  withActions,
  payload,
  userId,
  senderName,
  starredBy,
  onStarMessage,
}: IProps) => {
  const { containerStyle, userImg } = fromUser
    ? {
        containerStyle: { backgroundColor: `${layoutPrimaryColor}20` },
        userImg: null,
      }
    : {
        containerStyle: undefined,
        userImg: (
          <ContactAvatar
            size="small"
            name={senderName ?? ""}
            className="me-2 mt-1"
          />
        ),
      };

  const { createdAt, message } = payload;

  const isStarred = userId && starredBy?.includes(userId);

  return (
    <>
      <Card
        className={`border-0 text-start p-3 message-width position-relative message-box`}
        bodyStyle={{ padding: 0 }}
        style={containerStyle}
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
                  label: isStarred ? "Unstar" : "Star",
                  icon: <StarOutlined />,
                  onClick: () => onStarMessage?.(payload.id, !isStarred),
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
              type="dashed"
              icon={<DownOutlined style={{ fontSize: 12 }} />}
            />
          </Dropdown>
        )}
        {payload.replyingTo && (
          <Card
            className="message-reply-box"
            style={{
              borderLeft: "1px solid " + layoutPrimaryColor,
              fontSize: "0.8rem",
              backgroundColor: "inherit" + "5",
            }}
          >
            <strong className="capitalize">
              {payload.replyingTo.senderId === userId
                ? "You"
                : payload.replyingTo.sender}
            </strong>
            <Typography.Paragraph className="m-0" ellipsis={{ rows: 3 }}>
              {payload.replyingTo.message}
            </Typography.Paragraph>
          </Card>
        )}

        <Typography.Paragraph
          ellipsis={{ rows: 10, expandable: true, symbol: "more" }}
          className="mb-2"
        >
          {userImg}
          {message}
        </Typography.Paragraph>
          <div>{userId && isStarred && (<div className="d-inline-block">
            <StarFilled
                style={{
                  color: '#faad14',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onStarMessage?.(payload.id, !isStarred);
                }}
              />
          </div>)}
        <small className="text-start px-2 rounded">
          {getMessageTime(createdAt).toLowerCase()}
        </small></div>
      </Card>
    </>
  );
};

export default MessageBox;

