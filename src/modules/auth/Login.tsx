import { Link, useLocation, useNavigate } from "react-router-dom";
import { paths } from "../../utils/paths";
import { Button, Form, Input, Spin } from "antd";
import { useLogin3rdPartyMutation, useLoginMutation } from "./api";
import { IAuthResponse, ILogin } from "./api/types";
import { useDispatch } from "react-redux";
import { setAppState } from "./control/userSlice";
import useApiResponseHandler from "../../app/hooks/useApiResponseHandler";
import { GoogleOutlined, LoadingOutlined } from "@ant-design/icons";
import useSocialAuth from "../../app/hooks/useSocialAuth";
import { useState } from "react";

const Login = () => {
  const [loginUser, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apiResponseHandler = useApiResponseHandler();

  const { authWithGoogle } = useSocialAuth();
  const [customLoading, setCustomLoading] = useState(false);

  const [loginWithThirdParty, { isLoading: thirdPartyLoading }] =
    useLogin3rdPartyMutation();

  const signupState = useLocation().state || {};

  const onSuccessfulLogin = (apiResponse: IAuthResponse) => {
    dispatch(
      setAppState({
        auth: { token: apiResponse.token },
        user: apiResponse.user,
      })
    );
    navigate(paths.home);
  };

  const onFinish = async (values: ILogin) => {
    const res: any = await loginUser(values);

    apiResponseHandler(res, {
      onSuccess: {
        callBack: () => onSuccessfulLogin(res.data),
      },
    });
  };

  const onGoogleLogin = async () => {
    setCustomLoading(true);
    const resp = await authWithGoogle();

    if (resp?.token) {
      const resp2: any = await loginWithThirdParty(resp.token);
      apiResponseHandler(resp2, {
        onSuccess: {
          callBack: () => onSuccessfulLogin(resp2.data),
        },
      });
    }
    setCustomLoading(false);
  };

  return (
    <Spin indicator={<LoadingOutlined />} spinning={customLoading}>
      <p>
        Don't have an account?{" "}
        <Link className="reset-color" to={paths.signup}>
          Create an account.
        </Link>
      </p>

      <Form layout="vertical" onFinish={onFinish} initialValues={signupState}>
        <Form.Item label="E-Mail" name="email">
          <Input type="email" required className="border" size="large" />
        </Form.Item>
        <Form.Item className="mb-3" label="Password" name="password">
          <Input.Password type="password" required size="large" />
        </Form.Item>

        <Link
          className="float-end reset-color"
          to={paths.forgotPassword}
          replace
        >
          Forgot Password
        </Link>

        <Button
          loading={isLoading}
          size="large"
          className="mt-5"
          htmlType="submit"
          type="primary"
          block
        >
          Login
        </Button>
      </Form>
      <Button
        onClick={onGoogleLogin}
        size="large"
        className="mt-5"
        block
        icon={<GoogleOutlined />}
        loading={thirdPartyLoading}
        type="link"
      >
        Login with google
      </Button>
    </Spin>
  );
};

export default Login;

