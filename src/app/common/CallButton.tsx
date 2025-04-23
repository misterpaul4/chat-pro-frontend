import { PhoneOutlined } from "@ant-design/icons";
import { useContext } from "react";
import callContext from "../../modules/home/context/callContext";

interface IProps {
  recipientId: string;
  recipientName: string;
  userName: string
}

const CallButton = ({recipientId, recipientName, userName}: IProps) => {
  const { makeCall } = useContext(callContext);

  return (
    <PhoneOutlined
      onClick={() => makeCall(recipientId, recipientName, userName)}
      className="cursor-pointer"
      style={{ fontSize: 20 }}
    />
  );
};

export default CallButton;
