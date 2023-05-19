import { useEffect } from "react";
import { SocketEvents } from "../lib/types/webSocket";
import socket from "../api/socket";

interface IProps {
  event: `${SocketEvents}`;
  handler: (data?: any) => void;
}

const useSocketSubscription = ({ event, handler }: IProps) => {
  useEffect(() => {
    socket.off(event).on(event, handler);
  }, []);
};

export default useSocketSubscription;

