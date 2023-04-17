import { configureStore } from "@reduxjs/toolkit";
import apis from "../app/api";
import userReducer from "../modules/auth/control/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [apis.reducerPath]: apis.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apis.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

