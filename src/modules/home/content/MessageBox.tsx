import { Card, Dropdown } from "antd";
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
}

const MessageBox = ({ fromUser, withActions, payload }: IProps) => {
  const style: CSSProperties = fromUser
    ? { background: "gray", color: "white" }
    : { background: "white" };

  const { createdAt, message } = payload;

  return (
    <>
      <Card
        className="border-0 text-start p-3 message-width position-relative message-box"
        style={style}
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
            <div className="rounded-circle p-1" style={style}>
              <DownOutlined style={{ fontSize: 12 }} />
            </div>
          </Dropdown>
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

