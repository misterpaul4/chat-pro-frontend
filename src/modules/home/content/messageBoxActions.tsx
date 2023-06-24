import Icon, { EnterOutlined, StarOutlined } from "@ant-design/icons";
import { ForwardIcon } from "../../../utils/icons";

export const actions = [
  {
    label: "Reply",
    icon: <EnterOutlined />,
  },
  {
    label: "Star",
    icon: <StarOutlined />,
  },
  {
    label: "Forward",
    icon: <Icon style={{ fontSize: 15 }} component={ForwardIcon} />,
  },
];

