import { PhoneOutlined } from "@ant-design/icons";
import { useContext } from "react";
import callContext from "../../modules/home/context/callContext";

interface IProps {
  userId: string;
}

const CallButton = ({userId}: IProps) => {
  const { makeCall } = useContext(callContext);

  return (
    <PhoneOutlined
      onClick={() => makeCall(userId)}
      className="cursor-pointer"
      style={{ fontSize: 20 }}
    />
  );
};

export default CallButton;
