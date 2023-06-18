import { $typing, ITypingResponse } from "../api/types";

export enum typingActionType {
  Update = "Update",
}

interface IActionType {
  type: `${typingActionType}`;
  payload: any;
}

export const typingInitialState: $typing = {};

export function typingReducer(state: $typing, action: IActionType) {
  switch (action.type) {
    case "Update":
      const { isTyping, threadId, clientId } =
        action.payload as ITypingResponse;
      if (isTyping) {
        return { ...state, [threadId]: clientId };
      } else {
        const { [threadId]: deletedKey, ...rest } = state;
        return rest;
      }
    default:
      return state;
  }
}

