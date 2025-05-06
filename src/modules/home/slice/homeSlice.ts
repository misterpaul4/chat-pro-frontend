import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { $tabType } from "../sidebar/types";
import { getLs, setLS } from "../../../app/lib/helpers/localStorage";
import { IMessage, IThread, ThreadTypeEnum } from "../api/types";
import cloneDeep from "lodash/cloneDeep";
export interface IHomeSliceBase {
  activeThread: IThread | undefined;
  activeTab: $tabType;
}

export interface IHomeSlice extends IHomeSliceBase {
  isNewThreadDisplay: boolean;
  micPermission: PermissionStatus['state'];
}

const initialState: IHomeSlice = {
  activeThread: undefined,
  activeTab: getLs("activeTab") ?? "inbox",
  isNewThreadDisplay: false,
  micPermission: 'prompt',
};

export const homeSlice = createSlice({
  name: "app-slice",
  initialState,
  reducers: {
    setActiveThread: (state, action: PayloadAction<IThread | undefined>) => {
      return {
        ...state,
        activeThread: action.payload,
        isNewThreadDisplay: true,
      };
    },
    setActiveTab: (state, action: PayloadAction<$tabType>) => {
      setLS("activeTab", action.payload);
      return { ...state, activeTab: action.payload };
    },
    setRequestApproval: (state, action: PayloadAction<IHomeSliceBase>) => {
      setLS("activeTab", action.payload.activeTab);
      return {
        ...state,
        activeThread: action.payload.activeThread,
        activeTab: action.payload.activeTab,
      };
    },
    setRequestApprovalUpdate: (state, action: PayloadAction<IThread>) => {
      if (action.payload.id === state.activeThread?.id) {
        return { ...state, activeThread: action.payload };
      }
      return state;
    },
    setRequestRejectionUpdate: (state, action: PayloadAction<string>) => {
      if (action.payload === state.activeThread?.id) {
        return { ...state, activeThread: undefined };
      }
      return state;
    },
    setNewMessage: (state, action: PayloadAction<IMessage>) => {
      if (action.payload.threadId === state.activeThread?.id) {
        const activeThreadCopy: IThread = {
          ...state.activeThread,
          messages: [action.payload, ...state.activeThread.messages],
        };
        return {
          ...state,
          activeThread: activeThreadCopy,
          isNewThreadDisplay: false,
        };
      }
      return state;
    },
    goToClickedThread: (state, action: PayloadAction<IThread>) => {
      return {
        ...state,
        activeThread: action.payload,
        activeTab:
          action.payload.type === ThreadTypeEnum.Request ? "request" : "inbox",
      };
    },
    setMicPermission: (state, action: PayloadAction<PermissionStatus['state']>) => {
      return { ...state, micPermission: action.payload };
    },
    setStarMessage: (state, action: PayloadAction<{ messageId: string, isStarred: boolean, userId: string }>) => {
      const { messageId, isStarred, userId } = action.payload;

      const messageIndex = state.activeThread?.messages.findIndex(
        (msg) => msg.id === messageId
      );

      if (messageIndex === -1) return state;

      const activeThreadCopy: IThread = cloneDeep(state.activeThread);


      const message = activeThreadCopy.messages[messageIndex!];


      const starredUsers = message.starredBy
        ? message.starredBy.split(',').filter(Boolean)
        : [];
      const isStarredByUser = starredUsers.includes(userId);

      if (isStarred === isStarredByUser) {
        return state;
      }

      if (isStarred) {
        starredUsers.push(userId);
      } else {
        const index = starredUsers.indexOf(userId);
        if (index > -1) {
          starredUsers.splice(index, 1);
        }
      }


      message.starredBy = starredUsers.join(',');
      message.starred = starredUsers.length > 0;

      activeThreadCopy.messages[messageIndex!] = message;

      return {...state, activeThread: activeThreadCopy};
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setActiveThread,
  setActiveTab,
  setRequestApproval,
  setRequestApprovalUpdate,
  setRequestRejectionUpdate,
  setNewMessage,
  setMicPermission,
  goToClickedThread,
  setStarMessage,
} = homeSlice.actions;

export default homeSlice.reducer;

