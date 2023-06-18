import { Card } from "antd";
import { layoutPrimaryColor, transparentTextColor } from "../../../settings";
import { getMessageTime } from "../../../app/lib/helpers/time";
import { CSSProperties } from "react";

interface IProps {
  createdAt: string;
  message: string;
  fromUser: boolean;
}

const MessageBox = ({ message, fromUser, createdAt }: IProps) => {
  const style: CSSProperties = fromUser
    ? { background: "gray", color: "white" }
    : { background: "white" };

  return (
    <Card
      // extra={<em>test</em>}
      className="border-0 text-start p-3 message-width"
      style={style}
      bodyStyle={{ padding: 0 }}
    >
      <div className="text-end" style={{ color: transparentTextColor }}>
        {getMessageTime(createdAt)}
      </div>
      <p className="m-0">{message}</p>
    </Card>
  );
};

export default MessageBox;

