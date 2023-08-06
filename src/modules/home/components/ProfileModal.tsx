import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Modal, Popconfirm, Row, Typography } from "antd";
import { IBaseUser } from "../../auth/control/types";
import { getLastMessageTime } from "../../../app/lib/helpers/time";

interface IProps {
  visible: boolean;
  onClose: () => void;
  user: IBaseUser;
}

const ProfileModal = ({ visible, onClose, user }: IProps) => {
  return (
    <Modal
      cancelButtonProps={{ className: "d-none" }}
      okButtonProps={{ className: "d-none" }}
      open={visible}
      onCancel={onClose}
      className="profile-modal"
      title="Profile"
      footer={
        <div className="d-flex justify-content-between">
          <small>
            <em>last changed {getLastMessageTime(user.updatedAt)}</em>
          </small>

          <Popconfirm title="Are you sure?">
            <Button type="primary" danger>
              Change email
            </Button>
          </Popconfirm>
        </div>
      }
    >
      <Avatar
        className="d-flex justify-content-center"
        style={{ margin: "0 auto" }}
        size={100}
        icon={<UserOutlined />}
      />

      <Card className="my-5" bordered={false}>
        <div className="d-flex flex-column">
          <div className="capitalize">
            <strong>First Name:</strong>
            <Typography.Text
              editable={{ autoSize: { maxRows: 1 } }}
              className="m-2"
            >
              {user.firstName}
            </Typography.Text>
          </div>

          <div className="capitalize my-2">
            <strong>Last Name:</strong>
            <Typography.Text editable className="m-2">
              {user.lastName}
            </Typography.Text>
          </div>

          <div>
            <strong>Email:</strong>
            <Typography.Text className="m-2">{user.email}</Typography.Text>
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default ProfileModal;

