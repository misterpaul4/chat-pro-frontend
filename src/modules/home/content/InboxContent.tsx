import { IThread, ThreadTypeEnum } from "../api/types";

interface IProps {
  thread: IThread;
}

const InboxContent = ({ thread }: IProps) => {
  const { type } = thread;

  return type === ThreadTypeEnum.Request ? (
    <>Request not approved</>
  ) : (
    <>Inbox content</>
  );
};

export default InboxContent;

