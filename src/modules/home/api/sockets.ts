import socket from "../../../app/api/socket";
import { SocketEvents } from "../../../app/lib/types/webSocket";
import { IsTypingPayload } from "./types";

export const emitIsTyping = (payload: IsTypingPayload) =>
  socket.emit(SocketEvents.TYPING, payload);

