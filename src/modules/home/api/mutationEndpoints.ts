import apis from "../../../app/api";
import { apiTags } from "../../../app/lib/constants/tags";
import { IUser } from "../../auth/control/types";
import {
  IChatRequest,
  IChatRequestPayload,
  IContact,
  IVerifyEmail,
} from "./types";

const endpoints = apis.injectEndpoints({
  endpoints: (builder) => ({
    verifyEmail: builder.mutation<IUser, IVerifyEmail>({
      query: (body) => ({ url: "users/verify-email", method: "POST", body }),
    }),
    sendChatRequest: builder.mutation<IChatRequest[], IChatRequestPayload>({
      query: (body) => ({
        url: "users/chat-requests/send",
        method: "POST",
        body,
      }),
      invalidatesTags: (x) => (x ? [apiTags.CONTACTS, apiTags.INBOX] : []),
    }),
    approveRequest: builder.mutation<IContact, string>({
      query: (id) => ({
        url: `users/chat-requests/approve/${id}`,
        method: "POST",
      }),
      invalidatesTags: (result) =>
        result ? [apiTags.CONTACTS, apiTags.CHAT_REQUESTS] : [],
    }),
    declineRequest: builder.mutation<IContact, string>({
      query: (id) => ({
        url: `users/chat-requests/decline/${id}`,
        method: "POST",
      }),
      invalidatesTags: (result) =>
        result ? [apiTags.CONTACTS, apiTags.CHAT_REQUESTS] : [],
    }),
  }),
});

export const {
  useVerifyEmailMutation,
  useSendChatRequestMutation,
  useApproveRequestMutation,
  useDeclineRequestMutation,
} = endpoints;

