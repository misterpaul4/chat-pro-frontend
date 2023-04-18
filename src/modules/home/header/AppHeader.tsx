import { Avatar, Button, Dropdown, MenuProps, Space } from "antd";
import { IUser } from "../../auth/control/types";
import {
  DownOutlined,
  LogoutOutlined,
  StarFilled,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { logout } from "../../auth/control/userSlice";

interface IProps {
  user: IUser;
}

const AppHeader = ({ user }: IProps) => {
  const dispatch = useDispatch();

  const items: MenuProps["items"] = [
    {
      label: (
        <Button type="text">
          <UserOutlined /> Profile
        </Button>
      ),

      type: "group",
    },
    {
      label: (
        <Button type="text">
          <StarFilled style={{ color: "#ebdb34" }} /> Starred Messages
        </Button>
      ),

      type: "group",
    },
    {
      type: "group",
      label: (
        <Button
          type="text"
          className="text-danger"
          onClick={() => dispatch(logout())}
        >
          <LogoutOutlined /> Logout
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Dropdown
        menu={{
          items,
          className: "cursor-pointer",
          selectable: false,
        }}
        trigger={["click"]}
        placement="bottom"
      >
        <Space className="cursor-pointer">
          <Avatar size={30} icon={<UserOutlined />} />
          <strong>{user.firstName.toUpperCase()}</strong>
          <DownOutlined />
        </Space>
      </Dropdown>
    </div>
  );
};

export default AppHeader;

