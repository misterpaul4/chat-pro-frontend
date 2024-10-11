import { PhoneOutlined } from "@ant-design/icons";
import { useContext } from "react";
import callContext from "../../modules/home/context/callContext";

interface IProps {
  remotePeerId: string;
}

const CallButton = ({remotePeerId}: IProps) => {
  const { makeCall } = useContext(callContext);

  return (
    <PhoneOutlined
      onClick={() => makeCall(remotePeerId)}
      className="cursor-pointer"
      style={{ fontSize: 20 }}
    />
  );
};

export default CallButton;
