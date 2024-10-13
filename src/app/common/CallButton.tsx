import { PhoneOutlined } from "@ant-design/icons";
import { useContext } from "react";
import callContext from "../../modules/home/context/callContext";

interface IProps {
  recipientId: string;
  recipientName: string;
  userName: string
  callerId: string
}

const CallButton = ({recipientId, recipientName, userName, callerId}: IProps) => {
  const { makeCall } = useContext(callContext);

  return (
    <PhoneOutlined
      onClick={() => makeCall(recipientId, recipientName, userName, callerId)}
      className="cursor-pointer"
      style={{ fontSize: 20 }}
    />
  );
};

export default CallButton;
