import { $onlineStatus, $typing, IOnlineStatus } from "../api/types";

export enum isOnlineActionType {
  Update = "Update",
}

interface IActionType {
  type: `${isOnlineActionType}`;
  payload: IOnlineStatus;
}

export const onlineStatusInitialState: $onlineStatus = [];

export function onlineStatusReducer(state: $onlineStatus, action: IActionType) {
  switch (action.type) {
    case "Update":
      const { isOnline, user } = action.payload;
      if (isOnline) {
        return [...state, user];
      } else {
        return state.filter((us) => us !== user);
      }
    default:
      return state;
  }
}

