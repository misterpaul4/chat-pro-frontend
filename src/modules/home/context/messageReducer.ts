import { IInbox, IThread } from "../api/types";

export enum messageActionType {
  Initialize = "Initialize",
  Add_message = "Add_message",
  Insert = "Insert",
}

interface IActionType {
  type: messageActionType;
  payload: any;
}

export const messageInitialState: IInbox = [];

export function messageReducer(state: IInbox, action: IActionType) {
  switch (action.type) {
    case "Initialize":
      return action.payload;
    case "Add_message":
      return [...state, action.payload];
    case "Insert":
      const dup: IInbox = [...state];
      const threadIndex = dup.findIndex((th) => th.id === action.payload.id);
      dup[threadIndex].messages.unshift(action.payload.message);
      return dup;
    default:
      return state;
  }
}

