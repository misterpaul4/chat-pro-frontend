import { Card, Typography } from "antd";
import { IBaseUser } from "../../auth/control/types";
import { $activeContact } from "../api/types";
import { capitalize } from "../../../utils/strings";

interface IProps {
  activeContact: IBaseUser;
}

const ActionHeader = ({ activeContact }: IProps) => {
  return (
    <Card
      className="text-start"
      style={{ borderRadius: 0 }}
      bodyStyle={{ padding: 15 }}
    >
      <Typography.Title level={4} className="m-0">
        {capitalize(activeContact?.firstName)}{" "}
        {capitalize(activeContact?.lastName)}
      </Typography.Title>
    </Card>
  );
};

export default ActionHeader;

