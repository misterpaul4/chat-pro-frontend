import { Card } from "antd";
import { CSSProperties } from "react";
import { getMessageTime } from "../../../app/lib/helpers/time";

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
    <>
      <Card
        className="border-0 text-start p-3 message-width"
        style={style}
        bodyStyle={{ padding: 0 }}
      >
        <p className="m-0">{message}</p>
        <small className="text-start text-secondary bg-light px-2">
          {getMessageTime(createdAt).toLowerCase()}
        </small>
      </Card>
    </>
  );
};

export default MessageBox;

