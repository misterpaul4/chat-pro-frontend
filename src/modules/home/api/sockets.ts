import socket from "../../../app/api/socket";
import { SocketEvents } from "../../../app/lib/types/webSocket";
import { ICreateMessage, IsTypingPayload } from "./types";

export const emitIsTyping = (payload: IsTypingPayload) =>
  socket.emit(SocketEvents.TYPING, payload);

export const emitNewMessage = (
  payload: ICreateMessage,
  resposeCallBack: (response) => void
) => socket.emit(SocketEvents.NEW_MESSAGE, payload, resposeCallBack);

