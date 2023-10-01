import { io } from "socket.io-client";
import { getLs } from "../lib/helpers/localStorage";
import { BASE_URL } from "../../settings";

const socket = io(BASE_URL, {
  transports: ["websocket"],
  path: "/ws",
  autoConnect: false,
  withCredentials: true,
  auth: {
    token: getLs("token"),
  },
});

export default socket;

