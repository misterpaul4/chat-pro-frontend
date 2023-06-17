import { IThread, ThreadTypeEnum } from "../../modules/home/api/types";
import { transparentTextColor } from "../../settings";

interface IProps {
  typingClient: string | undefined;
  threadType: IThread["type"];
  threadUsers: IThread["users"];
}

const Typing = ({ typingClient, threadType, threadUsers }: IProps) => {
  let text = "typing...";
  if (threadType === ThreadTypeEnum.Group) {
    const typingClientName = threadUsers.find(
      (user) => user.email === typingClient
    )?.firstName;
    text = `${typingClientName} is ${text}`;
  }

  return (
    <em style={{ color: transparentTextColor, fontSize: "0.8rem" }}>{text}</em>
  );
};

export default Typing;

