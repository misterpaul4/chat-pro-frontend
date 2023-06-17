import { Card, Space, Typography } from "antd";
import { IThread, ThreadTypeEnum } from "../api/types";
import { capitalize } from "../../../utils/strings";
import { getPrivateThreadRecipient } from "../helpers";
import { typingContext } from "../context/typingContext";
import { useContext } from "react";
import Typing from "../../../app/common/IsTyping";

interface IProps {
  activeThread: IThread;
  userId: string;
}

interface IConfig {
  title: string;
}

const getRecipient = (users: IThread["users"], userId: string) => {
  const { firstName, lastName } = getPrivateThreadRecipient(users, userId);
  return `${capitalize(firstName)} ${capitalize(lastName)}`;
};

const getConfig: (activeThread: IThread, userId: string) => IConfig = (
  activeThread,
  userId
) => {
  switch (activeThread.type) {
    case ThreadTypeEnum.Private:
      return { title: getRecipient(activeThread.users, userId) };
    case ThreadTypeEnum.Group:
      return { title: capitalize(activeThread.title) };

    case ThreadTypeEnum.Request:
      return { title: getRecipient(activeThread.users, userId) };

    default:
      return { title: "You" };
  }
};

const ActionHeader = ({ activeThread, userId }: IProps) => {
  const typingState = useContext(typingContext);
  const typingClient = typingState[activeThread.id];

  const { title } = getConfig(activeThread, userId);

  return (
    <Card
      id="action-header"
      className="text-start"
      style={{ borderRadius: 0 }}
      bodyStyle={{ padding: 15 }}
    >
      <Space align="end">
        <Typography.Title level={4} className="m-0">
          {title}
        </Typography.Title>
        {typingClient && (
          <Typing
            typingClient={typingClient}
            threadType={activeThread.type}
            threadUsers={activeThread.users}
          />
        )}
      </Space>
    </Card>
  );
};

export default ActionHeader;

