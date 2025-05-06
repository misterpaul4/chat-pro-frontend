import { message, notification } from "antd";
import { useContext } from "react";
import globalContext from "../context/globalContext";

interface IResultConfig {
  callBack?: Function;
  display?: boolean;
  message?: string;
}

interface IApiResponseHandler {
  onSuccess?: IResultConfig;
  onError?: IResultConfig;
}

const useApiResponseHandler: () => (
  response: any,
  responseHandler?: IApiResponseHandler
) => boolean = () => {
  const { messageApi, notificationApi } = useContext(globalContext);

  const apiResponseHandler = (
    response: any,
    { onError, onSuccess }: IApiResponseHandler = {}
  ) => {

    const error = response.error || response.data?.error;
    if (error) {
      onError?.display !== false &&
        notificationApi.error({
          message:
          error?.data?.message ||
            onError?.message ||
            error?.message ||
            "Request failed",
        });
      onError?.callBack && onError.callBack();
      return false;
    } else if (response.data) {
      onSuccess?.display === true &&
        messageApi.success(
          onSuccess?.message ||
            response.message ||
            response.data.message ||
            "Success"
        );

      onSuccess?.callBack && onSuccess.callBack();
      return true;
    } else {
      message.info("Request completed");

      return true;
    }
  };

  return apiResponseHandler;
};

export default useApiResponseHandler;

