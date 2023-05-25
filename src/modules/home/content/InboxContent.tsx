import { List } from "antd";
import { IThread, ThreadTypeEnum } from "../api/types";
import MessageBox from "./MessageBox";

interface IProps {
  thread: IThread;
}

const InboxContent = ({ thread }: IProps) => {
  const { type } = thread;

  return type === ThreadTypeEnum.Request ? (
    <>Request not approved</>
  ) : (
    <List
      dataSource={thread.messages}
      renderItem={(item) => {
        const { message, createdAt } = item;
        return (
          <List.Item>
            <MessageBox
              createdAt={createdAt}
              message={message}
              fromUser={true}
            />
          </List.Item>
        );
      }}
    />
  );
};

export default InboxContent;

