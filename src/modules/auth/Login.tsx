import { Link, useLocation, useNavigate } from "react-router-dom";
import { paths } from "../../utils/paths";
import { Button, Form, Input } from "antd";
import { useLoginMutation } from "./api";
import { ILogin } from "./api/types";
import { useDispatch } from "react-redux";
import { setAppState } from "./control/userSlice";
import useApiResponseHandler from "../../app/hooks/useApiResponseHandler";

const Login = () => {
  const [loginUser, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apiResponseHandler = useApiResponseHandler();

  const signupState = useLocation().state || {};

  const onFinish = async (values: ILogin) => {
    const res: any = await loginUser(values);

    apiResponseHandler(res, {
      onSuccess: {
        callBack: () => {
          dispatch(
            setAppState({
              auth: { token: res.data.token },
              user: res.data.user,
            })
          );
          navigate(paths.home);
        },
      },
    });
  };

  return (
    <div>
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
    </div>
  );
};

export default Login;

