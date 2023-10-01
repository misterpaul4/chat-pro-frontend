import { useEffect } from "react";
import { SocketEvents } from "../lib/types/webSocket";
import socket from "../api/socket";

interface IProps {
  event: `${SocketEvents}`;
  handler: (data?: any) => void;
}

const useSocketSubscription = (subscriptions: IProps[]) => {
  useEffect(() => {
    subscriptions.forEach(({ event, handler }) => {
      socket.off(event).on(event, handler);
    });
  }, []);
};

export default useSocketSubscription;

