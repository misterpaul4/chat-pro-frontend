import apis from "../../../app/api";
import { ILogin, ISignUp } from "./types";

const endpoints = apis.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<void, ILogin>({
      query: (body) => ({ url: "auth/login", method: "POST", body }),
    }),
    signup: builder.mutation<void, ISignUp>({
      query: (body) => ({ url: "auth/signup", method: "POST", body }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = endpoints;

