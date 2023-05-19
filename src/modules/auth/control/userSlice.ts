import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IAuth, IBaseUser, IUser } from "./types";
import { clearLs, getLs, setLS } from "../../../app/lib/helpers/localStorage";
import socket from "../../../app/api/socket";

export interface IUserSlice {
  user: IBaseUser;
  auth: IAuth;
  darkMode: boolean;
}

const initialState: IUserSlice = {
  user: {
    email: "",
    firstName: "",
    id: "",
    lastName: "",
  },
  auth: {
    loggedIn: false,
    token: "",
  },
  darkMode: getLs("darkMode") ?? false,
};

type OmitLoggedInFromUser = Omit<IAuth, "loggedIn">;
type IUserSliceOmited = { user: IUser; auth: OmitLoggedInFromUser };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // sets when logged in
    setAppState: (_, action: PayloadAction<IUserSliceOmited>) => {
      const token = action.payload.auth.token;
      setLS("token", token);
      socket.auth = { token };
      socket.connect();
      return {
        ..._,
        auth: { loggedIn: true, token },
        user: action.payload.user,
      };
    },
    // sets when get-self is valid
    setGetSelf: (_, action: PayloadAction<IUser>) => {
      // get token from LS
      const token = getLs("token");
      socket.auth = { token };
      socket.connect();
      return {
        ..._,
        auth: { loggedIn: true, token },
        user: action.payload,
      };
    },
    logout: (state) => {
      clearLs("token");
      socket.disconnect();
      return {
        ...initialState,
        darkMode: state.darkMode,
      };
    },
    toggleDarkMode: (state) => {
      setLS("darkMode", !state.darkMode);
      return { ...state, darkMode: !state.darkMode };
    },
  },
});

// Action creators are generated for each case reducer function
export const { logout, setAppState, setGetSelf, toggleDarkMode } =
  userSlice.actions;

export default userSlice.reducer;

