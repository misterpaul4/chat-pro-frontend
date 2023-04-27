import { Avatar, Button, Drawer, Dropdown, MenuProps, Space } from "antd";
import { IBaseUser, IUser } from "../../auth/control/types";
import Icon, {
  DownOutlined,
  FormOutlined,
  LogoutOutlined,
  StarFilled,
  TeamOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { logout, toggleDarkMode } from "../../auth/control/userSlice";
import { useContext } from "react";
import headerContext from "../context/headerContext";
import { DarkModeIcon, LightModeIcon } from "../../../utils/icons";

interface IProps {
  user: IBaseUser;
  darkMode: boolean;
}

const AppHeader = ({ user, darkMode }: IProps) => {
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

  const darkModeConfig = darkMode
    ? { icon: DarkModeIcon, title: "Switch to Light Mode" }
    : { icon: LightModeIcon, title: "Switch to Dark Mode" };

  return (
    <>
      <Space size="large">
        <Button shape="circle" title="New Chat" onClick={onModalOpen}>
          <FormOutlined />
        </Button>
        <Button shape="circle" title="Contact List">
          <UsergroupAddOutlined />
        </Button>
        <Button shape="circle" title="Block List" type="primary" danger>
          <UsergroupDeleteOutlined />
        </Button>
        <Button
          shape="circle"
          onClick={() => dispatch(toggleDarkMode())}
          title={darkModeConfig.title}
        >
          <Icon component={darkModeConfig.icon} />
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

