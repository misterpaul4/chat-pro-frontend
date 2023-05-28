import { Card } from "antd";
import { transparentTextColor } from "../../../settings";
import { getMessageTime } from "../../../app/lib/helpers/time";

interface IProps {
  createdAt: string;
  message: string;
  fromUser: boolean;
}

const MessageBox = ({ createdAt, message, fromUser }: IProps) => {
  return (
    <Card
      className="border-0 text-start p-3 message-width"
      bodyStyle={{ padding: 0 }}
    >
      <p className="m-0">{message}</p>

      <em
        className={`mt-4 ${fromUser ? "float-end" : "float-start"}`}
        style={{ color: transparentTextColor }}
      >
        {getMessageTime(createdAt)}
      </em>
    </Card>
  );
};

export default MessageBox;

