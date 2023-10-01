import { Avatar, Button, Dropdown, Space, Typography } from "antd";
import { IBaseUser } from "../../auth/control/types";
import Icon, {
  DownOutlined,
  FormOutlined,
  LogoutOutlined,
  StarFilled,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { logout, toggleDarkMode } from "../../auth/control/userSlice";
import { useContext, useState } from "react";
import headerContext from "../context/headerContext";
import { DarkModeIcon, LightModeIcon } from "../../../utils/icons";
import { MenuItemGroupType, MenuItemType } from "antd/es/menu/hooks/useItems";
import ProfileModal from "../components/ProfileModal";

interface IProps {
  user: IBaseUser;
  darkMode: boolean;
}

interface ItemProps extends Partial<MenuItemGroupType<MenuItemType>> {
  onClick?: Function;
  disabled?: boolean;
}

const AppHeader = ({ user, darkMode }: IProps) => {
  const dispatch = useDispatch();

  const { onNewChatModalOpen, onContactListOpen } = useContext(headerContext);

  const [profileVisible, setProfileVisible] = useState(false);

  const onProfileModalClose = () => {
    setProfileVisible(false);
  };

  const items: ItemProps[] = [
    {
      label: <Typography.Text copyable>{user.email}</Typography.Text>,
    },
    {
      label: (
        <>
          <UserOutlined className="me-2" /> Profile
        </>
      ),
      onClick: () => setProfileVisible(true),
    },
    {
      label: (
        <>
          <StarFilled className="me-2" style={{ color: "#ebdb34" }} /> Starred
          Messages
        </>
      ),
      disabled: true,
    },
    {
      label: (
        <span className="text-danger">
          <LogoutOutlined className="me-2" /> Logout
        </span>
      ),
      onClick: () => dispatch(logout()),
    },
  ];

  const darkModeConfig = darkMode
    ? { icon: DarkModeIcon, title: "Switch to Light Mode" }
    : { icon: LightModeIcon, title: "Switch to Dark Mode" };

  return (
    <>
      <ProfileModal
        user={user}
        visible={profileVisible}
        onClose={onProfileModalClose}
      />
      <Space size="large">
        <Button shape="circle" title="New Chat" onClick={onNewChatModalOpen}>
          <FormOutlined />
        </Button>
        <Button shape="circle" title="Contact List" onClick={onContactListOpen}>
          <UsergroupAddOutlined />
        </Button>
        <Button
          shape="circle"
          onClick={() => {
            document.documentElement.style.setProperty(
              "color-scheme",
              darkMode ? "light" : "dark"
            );
            dispatch(toggleDarkMode(!darkMode));
          }}
          title={darkModeConfig.title}
        >
          <Icon component={darkModeConfig.icon} />
        </Button>
        <Dropdown
          menu={
            {
              items,
              selectable: false,
              className: "user-profile-menu",
              style: { minWidth: 250 },
            } as any
          }
          trigger={["click"]}
          getPopupContainer={(trigger) => trigger.parentElement!}
        >
          <Space className="cursor-pointer user-profile-dropdown">
            <Avatar className="border" size={30} icon={<UserOutlined />} />
            <strong id="user-profile-name">
              {user.firstName.toUpperCase()}
            </strong>
            <DownOutlined />
          </Space>
        </Dropdown>
      </Space>
    </>
  );
};

export default AppHeader;

