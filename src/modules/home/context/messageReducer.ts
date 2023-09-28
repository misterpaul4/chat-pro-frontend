import { getLs } from "../../../app/lib/helpers/localStorage";
import { IInbox, IMessage, IThread } from "../api/types";

export enum messageActionType {
  Initialize = "Initialize",
  NewThread = "NewThread",
  NewMessage = "NewMessage",
  ApprovedThread = "ApprovedThread",
  RemoveThread = "RemoveThread",
  ReadThread = "Readthread",
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
          unreadCountByUsers:
            getLs("activeThreadId") !== payload.message.threadId
              ? payload.unreadCountByUsers
              : {},
        },
        ...start,
        ...end,
      ];
    case "Readthread": {
      const { threadId, userId } = action.payload;
      const _stateCopy = [...state];
      const threadIndex = _stateCopy.findIndex((x) => x.id === threadId);
      const unreadCountByUsers = {
        ...(state[threadIndex]?.unreadCountByUsers ?? {}),
        [userId]: 0,
      };

      _stateCopy[threadIndex] = {
        ..._stateCopy[threadIndex],
        unreadCountByUsers,
      };
      return _stateCopy;
    }
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

