import { Avatar, Button, Drawer, Dropdown, MenuProps, Space } from "antd";
import { IBaseUser, IUser } from "../../auth/control/types";
import {
  DownOutlined,
  FormOutlined,
  LogoutOutlined,
  StarFilled,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { logout } from "../../auth/control/userSlice";
import { useContext } from "react";
import headerContext from "../context/headerContext";

interface IProps {
  user: IBaseUser;
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

  const { onModalOpen } = useContext(headerContext);

  return (
    <>
      <Space size="large">
        <Button shape="circle" title="New Chat" onClick={onModalOpen}>
          <FormOutlined />
        </Button>
        <Button shape="circle" title="Contact List">
          <TeamOutlined />
        </Button>
        <Dropdown
          menu={{
            items,
            className: "cursor-pointer",
            selectable: false,
          }}
          trigger={["click"]}
          placement="bottomLeft"
        >
          <Space className="cursor-pointer">
            <Avatar size={30} icon={<UserOutlined />} />
            <strong>{user.firstName.toUpperCase()}</strong>
            <DownOutlined />
          </Space>
        </Dropdown>
      </Space>
    </>
  );
};

export default AppHeader;

