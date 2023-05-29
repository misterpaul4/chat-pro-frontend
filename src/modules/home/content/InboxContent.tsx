import { List } from "antd";
import { IThread, ThreadTypeEnum } from "../api/types";
import MessageBox from "./MessageBox";

interface IProps {
  thread: IThread;
  userId: string;
}

const InboxContent = ({ thread, userId }: IProps) => {
  const { type } = thread;

  const messageLength = thread.messages.length - 1;

  return type === ThreadTypeEnum.Request ? (
    <>Request not approved</>
  ) : (
    <List
      dataSource={thread.messages}
      renderItem={(_, index) => {
        const { message, createdAt, senderId } =
          thread.messages[messageLength - index];
        const fromUser = senderId === userId;

        return (
          <List.Item
            className={`border-0 justify-content-${fromUser ? "end" : "start"}`}
          >
            <MessageBox
              createdAt={createdAt}
              message={message}
              fromUser={fromUser}
            />
          </List.Item>
        );
      }}
    />
  );
};

export default InboxContent;

