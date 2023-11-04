import { GoogleOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import useSocialAuth from "../../../app/hooks/useSocialAuth";
import { useConnectGoogleAuthMutation } from "../api/mutationEndpoints";
import { Dispatch } from "react";
import { AnyAction } from "@reduxjs/toolkit";
import useApiResponseHandler from "../../../app/hooks/useApiResponseHandler";
import { setUser } from "../../auth/control/userSlice";

const ConnectGoogle = ({
  id,
  dispatch,
}: {
  id: string;
  dispatch: Dispatch<AnyAction>;
}) => {
  const { authWithGoogle } = useSocialAuth();

  const [connect, { isLoading }] = useConnectGoogleAuthMutation();
  const responseHandler = useApiResponseHandler();

  const onConnect = async () => {
    const resp = await authWithGoogle();
    if (resp?.token) {
      const response = await connect({ id, token: resp.token });
      responseHandler(response, {
        onSuccess: {
          message: "You can now login with Google",
          display: true,
          callBack: () => {
            dispatch(setUser({ has3rdPartyAuth: true }));
          },
        },
      });
    }
  };

  return (
    <Popconfirm
      title="If you accept, you will be able to login with your google credentials"
      okText="Accept"
      cancelText="Cancel"
      onConfirm={onConnect}
    >
      <Button
        className="mt-5 mb-2 ms-3"
        type="dashed"
        icon={<GoogleOutlined />}
      >
        Connect Google Account
      </Button>
    </Popconfirm>
  );
};

export default ConnectGoogle;

