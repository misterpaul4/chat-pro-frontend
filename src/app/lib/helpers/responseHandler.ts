import { message, notification } from "antd";

interface IResultConfig {
  callBack?: Function;
  display?: boolean;
  message?: string;
}

interface IApiResponseHandler {
  onSuccess?: IResultConfig;
  onError?: IResultConfig;
}

export const apiResponseHandler = (
  response: any,
  { onError, onSuccess }: IApiResponseHandler = {}
) => {
  if (response.error) {
    onError?.display !== false &&
      notification.error({
        message:
          onError?.message ||
          response.error?.data?.message ||
          response.message ||
          "Request failed",
      });
    onError?.callBack && onError.callBack();
    return false;
  } else if (response.data) {
    onSuccess?.display === true &&
      message.success(
        onSuccess?.message ||
          response.message ||
          response.data.message ||
          "Success"
      );

    onSuccess?.callBack && onSuccess.callBack();
    return true;
  } else {
    message.info("Request completed");
  }
};

