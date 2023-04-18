import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IAuth, IBaseUser, IUser } from "./types";
import { clearLs, getLs, setLS } from "../../../app/lib/helpers/localStorage";

export interface IUserSlice {
  user: IBaseUser;
  auth: IAuth;
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
      return {
        auth: { loggedIn: true, token },
        user: action.payload.user,
      };
    },
    // sets when get-self is valid
    setGetSelf: (_, action: PayloadAction<IUser>) => {
      // get token from LS
      const token = getLs("token");
      return {
        auth: { loggedIn: true, token },
        user: action.payload,
      };
    },
    logout: () => {
      clearLs("token");
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { logout, setAppState, setGetSelf } = userSlice.actions;

export default userSlice.reducer;

