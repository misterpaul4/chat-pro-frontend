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
    setActiveContact: (state, action: PayloadAction<$activeContact>) => {
      return { ...state, activeContact: action.payload };
    },
    setActiveTab: (state, action: PayloadAction<$tabType>) => {
      return { ...state, activeTab: action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setActiveContact, setActiveTab } = homeSlice.actions;

export default homeSlice.reducer;

