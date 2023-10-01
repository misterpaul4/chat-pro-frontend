import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ISlice {}

const initialState = {};

export const slice = createSlice({
  name: "",
  initialState,
  reducers: {
    init: (state, action: PayloadAction<ISlice>) => {
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {} = slice.actions;

export default slice.reducer;

