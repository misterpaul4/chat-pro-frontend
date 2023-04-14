import apis from "../../../app/api";
import { ILogin } from "./types";

const endpoints = apis.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<void, ILogin>({
      query: (body) => ({ url: "auth/login", method: "POST", body }),
    }),
  }),
});

export const { useLoginMutation } = endpoints;

