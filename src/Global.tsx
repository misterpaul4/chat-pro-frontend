import { message, notification } from "antd";
import globalContext from "./app/context/globalContext";

const Global = () => {
  const [messageApi, mContextHolder] = message.useMessage();
  const [notificationApi, nContextHolder] = notification.useNotification();

  return (
    <globalContext.Provider value={{ notificationApi, messageApi }}>
      {mContextHolder} {nContextHolder}
    </globalContext.Provider>
  );
};

export default Global;

