import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { $tabType } from "../sidebar/types";
import { $activeContact } from "../api/types";

export interface IHomeSlice {
  activeContact: $activeContact | undefined;
  activeTab: $tabType;
}

const initialState: IHomeSlice = {
  activeContact: undefined,
  activeTab: "request",
};

export const homeSlice = createSlice({
  name: "app-slice",
  initialState,
  reducers: {
    setActiveContact: (
      state,
      action: PayloadAction<$activeContact | undefined>
    ) => {
      return { ...state, activeContact: action.payload };
    },
    setActiveTab: (state, action: PayloadAction<$tabType>) => {
      return { ...state, activeTab: action.payload };
    },
    setRequestApproval: (state, action: PayloadAction<IHomeSlice>) => ({
      ...state,
      activeContact: action.payload.activeContact,
      activeTab: action.payload.activeTab,
    }),
  },
});

// Action creators are generated for each case reducer function
export const { setActiveContact, setActiveTab, setRequestApproval } =
  homeSlice.actions;

export default homeSlice.reducer;

