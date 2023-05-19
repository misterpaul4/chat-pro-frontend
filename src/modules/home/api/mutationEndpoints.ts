import apis from "../../../app/api";
import { apiTags } from "../../../app/lib/constants/tags";
import { IUser } from "../../auth/control/types";
import {
  IChatRequestPayload,
  IInbox,
  IMassUpdateContacts,
  IVerifyEmail,
} from "./types";

const endpoints = apis.injectEndpoints({
  endpoints: (builder) => ({
    verifyEmail: builder.mutation<IUser, IVerifyEmail>({
      query: (body) => ({ url: "users/verify-email", method: "POST", body }),
    }),
    sendMessage: builder.mutation<IInbox, IChatRequestPayload>({
      query: (body) => ({
        url: "thread",
        method: "POST",
        body,
      }),
      invalidatesTags: (x) => (x ? [apiTags.INBOX] : []),
    }),
    approveRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `thread/${id}/approve`,
        method: "POST",
      }),
      // invalidatesTags: (x) =>
      //   x ? [apiTags.CHAT_REQUESTS, apiTags.INBOX, apiTags.CONTACTS] : [],
    }),
    declineRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `thread/${id}/decline`,
        method: "POST",
      }),
      // invalidatesTags: (x) =>
      //   x ? [apiTags.INBOX, apiTags.CHAT_REQUESTS, apiTags.CONTACTS] : [],
    }),
    massUpdateContacts: builder.mutation<void, IMassUpdateContacts>({
      query: (body) => ({
        url: `users/mass-update-contacts`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (x) => (x ? [apiTags.CONTACTS] : []),
    }),
  }),
});

export const {
  useVerifyEmailMutation,
  useSendMessageMutation,
  useApproveRequestMutation,
  useDeclineRequestMutation,
  useMassUpdateContactsMutation,
} = endpoints;

