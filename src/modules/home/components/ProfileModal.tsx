import {
  ArrowLeftOutlined,
  CloseOutlined,
  EditOutlined,
  LoadingOutlined,
  SaveOutlined,
  ToTopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Input,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { IBaseUser } from "../../auth/control/types";
import { getLastMessageTime } from "../../../app/lib/helpers/time";
import { useState } from "react";
import { useUpdateUserMutation } from "../api/mutationEndpoints";
import { useDispatch } from "react-redux";
import { setGetSelf } from "../../auth/control/userSlice";
import EmailChange from "./EmailChange";

interface IProps {
  visible: boolean;
  onClose: () => void;
  user: IBaseUser;
}

const ProfileModal = ({ visible, onClose, user }: IProps) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [editMode, setEditMode] = useState(false);
  const [emailChangeMode, setEmailChangeMode] = useState(false);

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

  const labelStyle: React.CSSProperties = { fontWeight: "bold" };

  const Wrapper = (value: string, setter: (value: string) => void) => {
    if (editMode) {
      return <Input value={value} onChange={(e) => setter(e.target.value)} />;
    }

    return value;
  };

  const onCancel = () => {
    setEditMode(false);
    setFirstName(user.firstName);
    setLastName(user.lastName);
  };

  const onEmailChangeMode = () => {
    setEmailChangeMode(true);
    onCancel();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      className="profile-modal"
      title={
        emailChangeMode ? (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => setEmailChangeMode(false)}
          >
            Back to profile
          </Button>
        ) : (
          <Typography.Title level={4}>Profile</Typography.Title>
        )
      }
      footer={null}
    >
      <Spin indicator={<LoadingOutlined />} spinning={isLoading}>
        {emailChangeMode ? (
          <EmailChange />
        ) : (
          <>
            <Avatar
              className="d-flex justify-content-center"
              style={{ margin: "0 auto" }}
              size={100}
              icon={<UserOutlined />}
            />

            {editMode ? (
              <Space>
                <Button
                  size="small"
                  type="dashed"
                  className="mt-5 mb-2"
                  icon={<CloseOutlined />}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  type="primary"
                  className="mt-5 mb-2"
                  icon={<SaveOutlined />}
                  onClick={onSave}
                  loading={isLoading}
                >
                  Save
                </Button>
              </Space>
            ) : (
              <Button
                size="small"
                type="primary"
                className="mt-5 mb-2"
                icon={<EditOutlined />}
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}

            <Descriptions bordered column={1}>
              <Descriptions.Item labelStyle={labelStyle} label="First Name">
                {Wrapper(firstName, setFirstName)}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={labelStyle} label="Last Name">
                {Wrapper(lastName, setLastName)}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={labelStyle} label="Email">
                {" "}
                <Popconfirm
                  title="Change email address?"
                  okText="Yes"
                  onConfirm={onEmailChangeMode}
                >
                  <EditOutlined
                    title="Change Email"
                    className="me-2 cursor-pointer"
                  />
                </Popconfirm>{" "}
                {user.email}{" "}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Spin>
    </Modal>
  );
};

export default ProfileModal;

