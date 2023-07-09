import apis from "../../../app/api";
import { apiTags } from "../../../app/lib/constants/tags";
import { IUser } from "../../auth/control/types";
import {
  IChatRequestPayload,
  ICreateMessage,
  IInbox,
  IMassUpdateContacts,
  IVerifyEmail,
} from "./types";

const endpoints = apis.injectEndpoints({
  endpoints: (builder) => ({
    verifyEmail: builder.mutation<IUser, IVerifyEmail>({
      query: (body) => ({ url: "users/verify-email", method: "POST", body }),
    }),
    createThread: builder.mutation<IInbox, IChatRequestPayload>({
      query: (body) => ({
        url: "thread",
        method: "POST",
        body,
      }),
    }),
    sendMessage: builder.mutation<void, ICreateMessage>({
      query: (body) => ({
        url: "thread/send-message",
        method: "POST",
        body,
      }),
    }),
    approveRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `thread/${id}/approve`,
        method: "POST",
      }),
    }),
    declineRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `thread/${id}/decline`,
        method: "POST",
      }),
    }),
    massUpdateContacts: builder.mutation<void, IMassUpdateContacts>({
      query: (body) => ({
        url: `users/mass-update-contacts`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (x) => (x ? [apiTags.CONTACTS] : []),
    }),
    readThread: builder.mutation<void, string>({
      query: (id) => ({
        url: `thread/read-message/${id}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useVerifyEmailMutation,
  useCreateThreadMutation,
  useApproveRequestMutation,
  useDeclineRequestMutation,
  useMassUpdateContactsMutation,
  useSendMessageMutation,
  useReadThreadMutation,
} = endpoints;

