import { IInbox, IMessage, IThread } from "../api/types";

export enum messageActionType {
  Initialize = "Initialize",
  NewThread = "NewThread",
  NewMessage = "NewMessage",
  ApprovedThread = "ApprovedThread",
  RemoveThread = "RemoveThread",
}

interface IActionType {
  type: `${messageActionType}`;
  payload: any;
}

export const messageInitialState: IInbox = [];

export function messageReducer(state: IInbox, action: IActionType) {
  switch (action.type) {
    case "Initialize":
      return action.payload;
    case "NewThread":
      return [action.payload, ...state];
    case "NewMessage":
      const payload = action.payload as {
        message: IMessage;
        unreadCountByUsers: IThread["unreadCountByUsers"];
      };
      const threadIndex = state.findIndex(
        (th) => th.id === payload.message.threadId
      );

      const start = state.slice(0, threadIndex);
      const end = state.slice(threadIndex + 1);

      return [
        {
          ...state[threadIndex],
          messages: [payload.message, ...state[threadIndex].messages],
          unreadCountByUsers: payload.unreadCountByUsers,
        },
        ...start,
        ...end,
      ];

    case "RemoveThread":
      return state.filter((thread) => thread.id !== action.payload.id);

    case "ApprovedThread":
      const _stateCopy = [...state];
      _stateCopy[action.payload.index] = {
        ..._stateCopy[action.payload.index],
        ...action.payload.data,
      };

      return _stateCopy;

    default:
      return state;
  }
}

