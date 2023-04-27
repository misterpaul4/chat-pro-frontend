import { Drawer, Typography } from "antd";
import { useContext } from "react";
import headerContext from "../context/headerContext";
import { drawerSharedProps } from "../constants/props";
import { IContact } from "../api/types";

interface IProps {
  contactList: IContact[] | undefined;
}

const ContactListDrawer = ({}: IProps) => {
  const { contactListVisibility, onContactListClose } =
    useContext(headerContext);

  const onClose = () => {
    onContactListClose();
  };

  return (
    <Drawer
      {...drawerSharedProps({ title: "Contacts" })}
      onClose={onClose}
      open={contactListVisibility}
    >
      content
    </Drawer>
  );
};

export default ContactListDrawer;

