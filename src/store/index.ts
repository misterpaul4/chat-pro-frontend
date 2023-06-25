import { configureStore } from "@reduxjs/toolkit";
import apis from "../app/api";
import userReducer from "../modules/auth/control/userSlice";
import homeReducer from "../modules/home/slice/homeSlice";
import threadMemoryReducer from "../modules/home/slice/threadMemorySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    app: homeReducer,
    memory: threadMemoryReducer,
    [apis.reducerPath]: apis.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apis.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

