import apis from "../../../app/api";
import { IGetSelf, ILogin, ISignUp } from "./types";

const endpoints = apis.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<void, ILogin>({
      query: (body) => ({ url: "auth/login", method: "POST", body }),
    }),
    signup: builder.mutation<void, ISignUp>({
      query: (body) => ({ url: "auth/signup", method: "POST", body }),
    }),
    getSelf: builder.query<IGetSelf, void>({
      query: () => "auth/get-self",
    }),
    submitForgotPass: builder.mutation<{ id: string }, string>({
      query: (email) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLazyGetSelfQuery,
  useSubmitForgotPassMutation,
} = endpoints;

