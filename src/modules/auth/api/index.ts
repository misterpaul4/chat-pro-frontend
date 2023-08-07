import apis from "../../../app/api";
import { apiTags } from "../../../app/lib/constants/tags";
import {
  IGetSelf,
  ILogin,
  IResetPasswordPayload,
  ISignUp,
  IVerificationCodePayload,
} from "./types";

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
      providesTags: [apiTags.SELF],
    }),
    submitForgotPass: builder.mutation<{ id: string }, string>({
      query: (email) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    submitVerificationCode: builder.mutation<void, IVerificationCodePayload>({
      query: (body) => ({
        url: "auth/verify-password-reset-code",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<void, IResetPasswordPayload>({
      query: (body) => ({
        url: "auth/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLazyGetSelfQuery,
  useSubmitForgotPassMutation,
  useSubmitVerificationCodeMutation,
  useResetPasswordMutation,
} = endpoints;

