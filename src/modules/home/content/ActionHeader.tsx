import { Badge, Card, Space, Typography } from "antd";
import { $onlineStatus, IThread, ThreadTypeEnum } from "../api/types";
import { capitalize } from "../../../utils/strings";
import { getPrivateThreadRecipient } from "../helpers";
import { typingContext } from "../context/typingContext";
import { useContext, useEffect } from "react";
import Typing from "../../../app/common/IsTyping";
import { IUser } from "../../auth/control/types";

interface IProps {
  activeThread: IThread;
  userId: string;
  onlineUsers: $onlineStatus;
}

interface IConfig {
  title: string;
  isOnline?: boolean;
}

const getConfig: (params: IProps) => IConfig = ({
  activeThread,
  userId,
  onlineUsers,
}) => {
  let recipient: IUser;

  switch (activeThread.type) {
    case ThreadTypeEnum.Private:
    case ThreadTypeEnum.Request:
      recipient = getPrivateThreadRecipient(activeThread.users, userId);

      return {
        title: `${capitalize(recipient.firstName)} ${capitalize(
          recipient.lastName
        )}`,
        isOnline: onlineUsers.includes(recipient.id),
      };
    case ThreadTypeEnum.Group:
      return { title: capitalize(activeThread.title) };

    default:
      return { title: "You" };
  }
};

const ActionHeader = ({ activeThread, userId, onlineUsers }: IProps) => {
  const typingState = useContext(typingContext);
  const typingClient = typingState[activeThread.id];

  const { title, isOnline } = getConfig({ activeThread, userId, onlineUsers });

  return (
    <Card
      id="action-header"
      className="text-start"
      style={{ borderRadius: 0 }}
      bodyStyle={{ padding: 15 }}
    >
      <Space align="end">
        <Space>
          <Typography.Title level={4} className="m-0">
            {title}
          </Typography.Title>
          {isOnline && (
            <span title="online">
              <Badge status="processing" />
            </span>
          )}
        </Space>
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

