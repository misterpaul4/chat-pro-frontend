import {
  Button,
  Card,
  Drawer,
  Input,
  List,
  Space,
  Tag,
  Typography,
} from "antd";
import { useContext, useMemo, useState } from "react";
import headerContext from "../context/headerContext";
import { drawerSharedProps } from "../constants/props";
import { IContact } from "../api/types";
import Icon from "@ant-design/icons";
import { PersonIcon } from "../../../utils/icons";
import { capitalize } from "../../../utils/strings";
import { hoverColor, transparentTextColor } from "../../../settings";

interface IProps {
  contactList: IContact[] | undefined;
}

const BlockedUsersDrawer = ({ contactList }: IProps) => {
  if (!contactList) return null;

  const { onBlockedContactListClose, blockedContactListVisibility } =
    useContext(headerContext);

  const onClose = () => {
    onBlockedContactListClose();
  };

  const blockList = useMemo(() => {
    if (contactList && blockedContactListVisibility) {
      return contactList.filter((contact) => contact.blocked);
    }
  }, [contactList, blockedContactListVisibility]);

  const [selected, setSelected] = useState<IContact[]>([]);
  const [filteredList, setFilteredList] = useState(blockList);

  return (
    <Drawer
      {...drawerSharedProps({ title: "Blocked Contacts" })}
      onClose={onClose}
      open={blockedContactListVisibility}
      destroyOnClose
    >
      {/* input area */}
      <Input placeholder="Search..." size="large" allowClear />
      {/* information area */}
      <Card
        className="mt-3"
        bordered={false}
        bodyStyle={{
          padding: 10,
          visibility: selected.length ? "visible" : "hidden",
        }}
      >
        <Tag icon={<Icon component={PersonIcon} />}>{selected.length}</Tag>
        <Tag className="cursor-pointer" color="blue-inverse">
          unblock selected
        </Tag>

        <Tag className="cursor-pointer" color="red-inverse">
          ublock all
        </Tag>
      </Card>
      <List
        className="mt-3"
        dataSource={filteredList}
        renderItem={(item) => {
          const { firstName, email, lastName } = item.contact;
          const isSlected = selected.find((contact) => contact.id === item.id);
          return (
            <List.Item
              style={{ backgroundColor: isSlected ? hoverColor : "" }}
              onClick={() => {
                if (isSlected) {
                  setSelected((current) =>
                    current.filter((contact) => contact.id !== item.id)
                  );
                } else {
                  setSelected((current) => [...current, item]);
                }
              }}
              className="cursor-pointer rounded"
            >
              <Typography.Text style={{ fontSize: "1.3rem" }}>
                <Space>
                  <Icon component={PersonIcon} className="me-2" />
                  <span>
                    {capitalize(firstName)} {capitalize(lastName)}{" "}
                    <span
                      style={{ color: transparentTextColor }}
                    >{`(${email})`}</span>
                  </span>
                </Space>
              </Typography.Text>
            </List.Item>
          );
        }}
      />
    </Drawer>
  );
};

export default BlockedUsersDrawer;

