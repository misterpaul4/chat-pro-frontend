import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Modal,
  Popconfirm,
  Space,
  Typography,
  message,
} from "antd";
import { IBaseUser } from "../../auth/control/types";
import { getLastMessageTime } from "../../../app/lib/helpers/time";
import { useState } from "react";
import { useUpdateUserMutation } from "../api/mutationEndpoints";
import { useDispatch } from "react-redux";
import { setGetSelf } from "../../auth/control/userSlice";

interface IProps {
  visible: boolean;
  onClose: () => void;
  user: IBaseUser;
}

const ProfileModal = ({ visible, onClose, user }: IProps) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useDispatch();
  const [update, { isLoading }] = useUpdateUserMutation();

  const onSave = async () => {
    const resp: any = await update({
      id: user.id,
      body: { firstName, lastName },
    });

    if (resp) {
      message.success("Saved");
      setEditMode(false);
      dispatch(setGetSelf(resp.data));
    }
  };

  const onEditStart = () => setEditMode(true);

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

          {editMode ? (
            <Space>
              <Popconfirm
                title="Cancel without saving?"
                onConfirm={() => {
                  setFirstName(user.firstName);
                  setLastName(user.lastName);
                  setEditMode(false);
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button>Cancel</Button>
              </Popconfirm>
              <Button type="primary" onClick={onSave} loading={isLoading}>
                Save
              </Button>
            </Space>
          ) : (
            <Popconfirm title="Are you sure?">
              <Button type="primary" danger>
                Change email
              </Button>
            </Popconfirm>
          )}
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
              editable={{
                tooltip: false,
                onChange: setFirstName,
                onStart: onEditStart,
              }}
              className="m-2"
            >
              {firstName}
            </Typography.Text>
          </div>

          <div className="capitalize my-2">
            <strong>Last Name:</strong>
            <Typography.Text
              editable={{
                tooltip: false,
                onChange: setLastName,
                onStart: onEditStart,
              }}
              className="m-2"
            >
              {lastName}
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

