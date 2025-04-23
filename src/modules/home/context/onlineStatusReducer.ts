import { $onlineStatus, IOnlineStatus } from "../api/types";

export enum isOnlineActionType {
  Update = "Update",
}

interface IActionType {
  type: `${isOnlineActionType}`;
  payload: IOnlineStatus;
}

export const onlineStatusInitialState: $onlineStatus = {};

export function onlineStatusReducer(state: any, action: IActionType) {
  switch (action.type) {
    case "Update":
      const { isOnline, user, lastSeen } = action.payload;
      return { ...state, [user]: isOnline ? true : lastSeen };

    default:
      return state;
  }
}

