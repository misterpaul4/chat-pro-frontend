import { Avatar, Button, Drawer, Input, List, Space, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import headerContext from "../context/headerContext";
import { drawerSharedProps } from "../constants/props";
import { IContact, IMassUpdateContacts } from "../api/types";
import Icon, { StarFilled, StarOutlined } from "@ant-design/icons";
import { BlockIcon, PersonIcon, UnBlockIcon } from "../../../utils/icons";
import { capitalize } from "../../../utils/strings";
import { layoutPrimaryColor, transparentTextColor } from "../../../settings";
import { useMassUpdateContactsMutation } from "../api/mutationEndpoints";
import { apiResponseHandler } from "../../../app/lib/helpers/responseHandler";
import ContactAvatar from "../../../app/common/ContactAvatar";

interface IProps {
  contactList: IContact[] | undefined;
}

const ContactListDrawer = ({ contactList }: IProps) => {
  const [updateContacts, { isLoading }] = useMassUpdateContactsMutation();

  const { onContactListClose, contactListVisibility } =
    useContext(headerContext);

  const [filteredList, setFilteredList] = useState<IContact[] | undefined>(
    contactList
  );

  const onClose = () => {
    onContactListClose();
  };

  const massUpdateContacts = async (payload: IMassUpdateContacts) => {
    const resp = await updateContacts(payload);
    apiResponseHandler(resp);
  };

  useEffect(() => {
    if (contactList) {
      setFilteredList((current: any) => {
        if (!current) {
          return contactList;
        }

        return current.map((ct) =>
          contactList.find((ctList) => ctList.id === ct.id)
        );
      });
    }
  }, [contactList]);

  if (!contactList) return null;

  const contactLength = contactList.length;

  const applySearch = (term: string) => {
    if (term) {
      const result = contactList.filter(
        (ct) =>
          ct.contact.email.includes(term) ||
          ct.contact.firstName.includes(term) ||
          ct.contact.lastName.includes(term)
      );

      setFilteredList(result);
    }
  };

  return (
    <Drawer
      {...drawerSharedProps({ title: "Contacts" })}
      onClose={onClose}
      open={contactListVisibility}
      destroyOnClose
      afterOpenChange={(open) => !open && setFilteredList(contactList)}
      footer={
        contactLength && (
          <div style={{ color: transparentTextColor }}>
            {contactLength} {contactLength > 1 ? "contacts" : "contact"}
          </div>
        )
      }
    >
      {/* input area */}
      {contactLength > 5 && (
        <Input
          onChange={(e) => applySearch(e.target.value.trim())}
          placeholder="Search..."
          size="large"
          allowClear
        />
      )}
      <List
        className="mt-3"
        dataSource={filteredList}
        renderItem={(item) => {
          const { firstName, email, lastName } = item.contact;
          return (
            <List.Item className="rounded px-3">
              <Typography.Text style={{ fontSize: "1.1rem" }}>
                <Space>
                  <ContactAvatar name={firstName} />
                  <span>
                    {capitalize(firstName)} {capitalize(lastName)}{" "}
                    <span
                      style={{ color: transparentTextColor }}
                    >{`(${email})`}</span>
                  </span>
                </Space>
              </Typography.Text>

              <Space>
                <Button
                  type="ghost"
                  onClick={() =>
                    massUpdateContacts({
                      contactIds: [item.id],
                      blocked: !item.blocked,
                    })
                  }
                  icon={
                    item.blocked ? (
                      <Icon style={{ color: "red" }} component={BlockIcon} />
                    ) : (
                      <Icon component={UnBlockIcon} />
                    )
                  }
                />

                <Button
                  type="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    massUpdateContacts({
                      contactIds: [item.id],
                      favourite: !item.favourite,
                    });
                  }}
                  icon={
                    item.favourite ? (
                      <StarFilled style={{ color: layoutPrimaryColor }} />
                    ) : (
                      <StarOutlined />
                    )
                  }
                />
              </Space>
            </List.Item>
          );
        }}
      />
    </Drawer>
  );
};

export default ContactListDrawer;

