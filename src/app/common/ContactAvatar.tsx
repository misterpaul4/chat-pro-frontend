import { Avatar, AvatarProps } from "antd";
import { contactColors, getContactColor } from "../../utils/colors";

interface IProps {
  name: string;
  className?: string;
  size?: AvatarProps["size"];
}

const ContactAvatar = ({ name, className = "", size }: IProps) => {
  const CN = (name[0] || "x").toUpperCase();

  return (
    <Avatar
      className={className}
      size={size}
      style={{
        backgroundColor: getContactColor(CN),
      }}
    >
      {CN}
    </Avatar>
  );
};

export default ContactAvatar;

