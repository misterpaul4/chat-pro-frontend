import Icon, { EnterOutlined, StarOutlined } from "@ant-design/icons";
import { ForwardIcon } from "../../../utils/icons";
import { IMessage, IThreadMemory } from "../api/types";
import { THREAD_MEMORY } from "../../../settings";

const onReply = (message: IMessage) => {
  const current: IThreadMemory = THREAD_MEMORY.get(message.threadId) || {};
  const value: IThreadMemory = { ...current, replyingTo: message };

  THREAD_MEMORY.set(message.threadId, value);
};

export const actions: (message: IMessage) => {
  label: string;
  icon: React.ReactElement;
  onClick?: Function;
  disabled?: boolean;
}[] = (message: IMessage) => [
  {
    label: "Reply",
    icon: <EnterOutlined />,
    onClick: () => onReply(message),
  },
  {
    label: "Star",
    icon: <StarOutlined />,
    disabled: true,
  },
  {
    label: "Forward",
    icon: <Icon style={{ fontSize: 15 }} component={ForwardIcon} />,
    disabled: true,
  },
];

