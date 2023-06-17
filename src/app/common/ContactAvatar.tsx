import { Avatar } from "antd";
import { contactColors, getContactColor } from "../../utils/colors";

interface IProps {
  name: string;
}

const ContactAvatar = ({ name }: IProps) => {
  const CN = (name[0] || "x").toUpperCase();

  return (
    <Avatar
      style={{
        backgroundColor: getContactColor(CN),
      }}
    >
      {CN}
    </Avatar>
  );
};

export default ContactAvatar;

