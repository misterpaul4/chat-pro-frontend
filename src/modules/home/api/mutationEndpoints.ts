import apis from "../../../app/api";
import { apiTags } from "../../../app/lib/constants/tags";
import { IUser } from "../../auth/control/types";
import { IChatRequestPayload, IInbox, IVerifyEmail } from "./types";

const endpoints = apis.injectEndpoints({
  endpoints: (builder) => ({
    verifyEmail: builder.mutation<IUser, IVerifyEmail>({
      query: (body) => ({ url: "users/verify-email", method: "POST", body }),
    }),
    sendChatRequest: builder.mutation<IInbox, IChatRequestPayload>({
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
      invalidatesTags: (x) => (x ? [apiTags.CHAT_REQUESTS, apiTags.INBOX] : []),
    }),
    declineRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `thread/${id}/decline`,
        method: "POST",
      }),
      invalidatesTags: (x) => (x ? [apiTags.INBOX, apiTags.CHAT_REQUESTS] : []),
    }),
  }),
});

export const {
  useVerifyEmailMutation,
  useSendChatRequestMutation,
  useApproveRequestMutation,
  useDeclineRequestMutation,
} = endpoints;

