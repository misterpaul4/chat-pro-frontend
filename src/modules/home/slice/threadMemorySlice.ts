import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IThreadMemory } from "../api/types";

export type $threadMemory = Record<string, Partial<IThreadMemory>>;

const initialState: $threadMemory = {};

export const threadMemorySlice = createSlice({
  name: "tm-slice",
  initialState,
  reducers: {
    setThreadMemory: (
      state,
      action: PayloadAction<{ key: string; value: Partial<IThreadMemory> }>
    ) => {
      const { key, value } = action.payload;
      return { ...state, [key]: { ...(state[key] || {}), ...value } };
    },
  },
});

export const { setThreadMemory } = threadMemorySlice.actions;

export default threadMemorySlice.reducer;

