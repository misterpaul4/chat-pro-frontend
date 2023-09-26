import { Avatar } from "antd";
import { contactColors, getContactColor } from "../../utils/colors";

interface IProps {
  name: string;
  className?: string;
}

const ContactAvatar = ({ name, className = "" }: IProps) => {
  const CN = (name[0] || "x").toUpperCase();

  return (
    <Avatar
      className={className}
      style={{
        backgroundColor: getContactColor(CN),
      }}
    >
      {CN}
    </Avatar>
  );
};

export default ContactAvatar;

