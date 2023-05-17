import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { $tabType } from "../sidebar/types";
import { $activeThread } from "../api/types";
import { getLs, setLS } from "../../../app/lib/helpers/localStorage";

export interface IHomeSlice {
  activeThread: $activeThread | undefined;
  activeTab: $tabType;
}

const initialState: IHomeSlice = {
  activeThread: undefined,
  activeTab: getLs("activeTab") ?? "inbox",
};

export const homeSlice = createSlice({
  name: "app-slice",
  initialState,
  reducers: {
    setActiveThread: (
      state,
      action: PayloadAction<$activeThread | undefined>
    ) => {
      return { ...state, activeThread: action.payload };
    },
    setActiveTab: (state, action: PayloadAction<$tabType>) => {
      setLS("activeTab", action.payload);
      return { ...state, activeTab: action.payload };
    },
    setRequestApproval: (state, action: PayloadAction<IHomeSlice>) => {
      setLS("activeTab", action.payload.activeTab);
      return {
        ...state,
        activeThread: action.payload.activeThread,
        activeTab: action.payload.activeTab,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setActiveThread, setActiveTab, setRequestApproval } =
  homeSlice.actions;

export default homeSlice.reducer;

