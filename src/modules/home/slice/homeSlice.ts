import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { $tabType } from "../sidebar/types";
import { getLs, setLS } from "../../../app/lib/helpers/localStorage";
import { IMessage, IThread } from "../api/types";

export interface IHomeSliceBase {
  activeThread: IThread | undefined;
  activeTab: $tabType;
}

export interface IHomeSlice extends IHomeSliceBase {
  isNewThreadDisplay: boolean;
}

const initialState: IHomeSlice = {
  activeThread: undefined,
  activeTab: getLs("activeTab") ?? "inbox",
  isNewThreadDisplay: false,
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
} = homeSlice.actions;

export default homeSlice.reducer;

