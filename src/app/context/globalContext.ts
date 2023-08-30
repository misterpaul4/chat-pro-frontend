import { MessageInstance, MessageType } from "antd/es/message/interface";
import { NotificationInstance } from "antd/es/notification/interface";
import { createContext } from "react";

interface IInitialValue {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
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
  },
  messageApi: {
    success: initializeMessage,
    error: initializeMessage,
    info: initializeMessage,
    warning: initializeMessage,
    open: initializeMessage,
    destroy: () => {},
    loading: initializeMessage,
  },
};

const globalContext = createContext(initialValue);

export default globalContext;

