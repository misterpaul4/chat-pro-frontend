import {
  ArrowLeftOutlined,
  CloseOutlined,
  EditOutlined,
  KeyOutlined,
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
import ChangePassword from "./ChangePassword";
import ConnectGoogle from "./ConnectGoogle";

interface IProps {
  visible: boolean;
  onClose: () => void;
  user: IBaseUser;
}

type $screen = "profile" | "email" | "password";

const ProfileModal = ({ visible, onClose, user }: IProps) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [editMode, setEditMode] = useState(false);
  const [screen, setScreen] = useState<$screen>("profile");

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

  const onScreenChange = (scn: $screen) => {
    setScreen(scn);
    onCancel();
  };

  const backToProfile = () => {
    setScreen("profile");
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={700}
      className="profile-modal"
      title={
        screen !== "profile" ? (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={backToProfile}
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
        {screen === "email" ? (
          <EmailChange backToProfile={backToProfile} />
        ) : screen === "password" ? (
          <ChangePassword
            hasPassword={user.hasPassword}
            backToProfile={backToProfile}
            dispatch={dispatch}
          />
        ) : (
          <>
            <Avatar
              className="d-flex justify-content-center profile-avatar"
              style={{ margin: "0 auto" }}
              size={100}
              icon={<UserOutlined />}
            />

            <Space>
              {editMode ? (
                <>
                  <Button
                    type="dashed"
                    className="mt-5 mb-2"
                    icon={<CloseOutlined />}
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    className="mt-5 mb-2"
                    icon={<SaveOutlined />}
                    onClick={onSave}
                    loading={isLoading}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  type="primary"
                  className="mt-5 mb-2"
                  icon={<EditOutlined />}
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </Button>
              )}

              <Popconfirm
                title="Are you sure?"
                okText="Yes"
                onConfirm={() => onScreenChange("password")}
              >
                <Button
                  type="primary"
                  className="mt-5 mb-2 bg-secondary ms-3"
                  icon={<KeyOutlined />}
                >
                  {user.hasPassword ? "Change" : "Add"} Password
                </Button>
              </Popconfirm>

              {!user.has3rdPartyAuth && (
                <ConnectGoogle id={user.id} dispatch={dispatch} />
              )}
            </Space>

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
                  onConfirm={() => onScreenChange("email")}
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

