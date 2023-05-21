import { cloneDeep } from "lodash";
import { IInbox, IThread } from "../api/types";

export enum messageActionType {
  Initialize = "Initialize",
  Add_message = "New_Thread",
  Insert = "Insert",
  ApprovedThread = "Approved_Thread",
  DeclinedThread = "Declined_Thread",
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
    case "New_Thread":
      return [action.payload, ...state];
    case "Insert":
      const stateClone: IInbox = cloneDeep(state);
      const threadIndex = stateClone.findIndex(
        (th) => th.id === action.payload.threadId
      );
      stateClone[threadIndex].messages.unshift(action.payload);

      return stateClone;

    default:
      return state;
  }
}

