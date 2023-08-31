import {
  ArrowLeftOutlined,
  CloseOutlined,
  EditOutlined,
  LoadingOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
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

  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();
  const [update, { isLoading }] = useUpdateUserMutation();

  const onSave = async () => {
    const resp: any = await update({
      id: user.id,
      body: { firstName, lastName },
    });

    if (resp) {
      messageApi.success("Saved");
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

  const backToProfile = () => {
    setEmailChangeMode(false);
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={700}
      className="profile-modal"
      getContainer={() => {
        return document.getElementById("user-profile-name") as HTMLElement;
      }}
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
        {contextHolder}
        {emailChangeMode ? (
          <EmailChange backToProfile={backToProfile} />
        ) : (
          <>
            <Avatar
              className="d-flex justify-content-center profile-avatar"
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

