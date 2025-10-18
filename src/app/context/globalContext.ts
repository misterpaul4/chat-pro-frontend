import { message, notification } from "antd";
import { createContext } from "react";

type MessageApi = ReturnType<typeof message.useMessage>[0];
type MessageType = ReturnType<MessageApi["open"]>;
type NotificationApi = ReturnType<typeof notification.useNotification>[0];

interface IInitialValue {
  messageApi: MessageApi;
  notificationApi: NotificationApi;
}

const initializeMessage = () => ({} as unknown as MessageType);

const initialValue: IInitialValue = {
  notificationApi: {
    success: () => {},
    error: () => {},
    info: () => {},
    warning: () => {},
    open: () => {},
    destroy: () => {},
  } as NotificationApi,
  messageApi: {
    success: initializeMessage,
    error: initializeMessage,
    info: initializeMessage,
    warning: initializeMessage,
    open: initializeMessage,
    destroy: () => {},
    loading: initializeMessage,
  } as MessageApi,
};

const globalContext = createContext(initialValue);

export default globalContext;
