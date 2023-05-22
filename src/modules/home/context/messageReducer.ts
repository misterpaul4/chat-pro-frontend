import { cloneDeep } from "lodash";
import { IInbox } from "../api/types";

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
      const stateClone: IInbox = cloneDeep(state); // temporary solution
      const threadIndex = stateClone.findIndex(
        (th) => th.id === action.payload.threadId
      );
      stateClone[threadIndex].messages.unshift(action.payload);

      return stateClone;

    case "RemoveThread":
      return state.filter((thread) => thread.id !== action.payload.id);

    case "ApprovedThread":
      const index = state.findIndex((th) => th.id === action.payload.id);
      const _stateClone: IInbox = cloneDeep(state);
      _stateClone[index] = { ..._stateClone[index], ...action.payload };

      return _stateClone;

    default:
      return state;
  }
}

