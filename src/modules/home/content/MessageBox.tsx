import { Card, Dropdown } from "antd";
import { CSSProperties } from "react";
import { getMessageTime } from "../../../app/lib/helpers/time";
import { DownOutlined } from "@ant-design/icons";
import { actions } from "./messageBoxActions";

interface IProps {
  createdAt: string;
  message: string;
  fromUser: boolean;
  withActions?: boolean;
}

const MessageBox = ({ message, fromUser, createdAt, withActions }: IProps) => {
  const style: CSSProperties = fromUser
    ? { background: "gray", color: "white" }
    : { background: "white" };

  return (
    <>
      <Card
        className="border-0 text-start p-3 message-width position-relative message-box"
        style={style}
        bodyStyle={{ padding: 0 }}
      >
        {withActions && (
          <Dropdown
            menu={{
              items: actions as any,
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

