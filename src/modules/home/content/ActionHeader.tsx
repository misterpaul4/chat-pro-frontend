import { Badge, Card, Space, Typography } from "antd";
import { $onlineStatus, IThread, ThreadTypeEnum } from "../api/types";
import { capitalize } from "../../../utils/strings";
import { getPrivateThreadRecipient } from "../helpers";
import { typingContext } from "../context/typingContext";
import { useContext, useEffect } from "react";
import Typing from "../../../app/common/IsTyping";
import { IUser } from "../../auth/control/types";
import { getMessageTime } from "../../../app/lib/helpers/time";
import { PhoneOutlined } from "@ant-design/icons";
import CallButton from "../../../app/common/CallButton";

interface IProps {
  activeThread: IThread;
  userId: string;
  onlineUsers: $onlineStatus;
}

interface IConfig {
  title: string;
  isOnline?: boolean | string;
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
        isOnline: onlineUsers[recipient.id] || recipient.lastSeen,
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
      <div className="d-flex align-items-center justify-content-between">
      <Space align="end">
        <Space>
          <Typography.Title level={4} className="m-0">
            {title}
          </Typography.Title>
          {isOnline && (
            <span title="online">
              {typeof isOnline === "boolean" ? (
                <Badge status="processing" />
              ) : (
                <em>last seen {getMessageTime(isOnline as string)}</em>
              )}
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

      <CallButton userId={userId} />
      </div>
    </Card>
  );
};

export default ActionHeader;

