import apis from "../../../app/api";
import { apiTags } from "../../../app/lib/constants/tags";
import { IBaseUser, IUser } from "../../auth/control/types";
import {
  IChangePassword,
  IChatRequestPayload,
  ICreateMessage,
  IEmailChange,
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
    updateUser: builder.mutation<
      void,
      { id: string; body: Partial<IBaseUser> }
    >({
      query: ({ id, body }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (x) => (x ? [apiTags.SELF] : []),
    }),
    emailChangeReq: builder.mutation<void, IVerifyEmail>({
      query: (body) => ({
        url: "auth/email-change-request",
        method: "POST",
        body,
      }),
    }),
    emailChangeReqSubmit: builder.mutation<void, IEmailChange>({
      query: (body) => ({
        url: "auth/email-change-submit",
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation<void, IChangePassword>({
      query: (body) => ({
        url: "auth/change-password",
        method: "POST",
        body,
      }),
    }),
    connectGoogleAuth: builder.mutation<void, { id: string; token: string }>({
      query: ({ token, id }) => ({
        url: `auth/connect/firebase/${id}`,
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
    initializePeerCall: builder.mutation<string, string>({
      query: (peerId) => ({
        url: `call-logs/call/initialize/${peerId}`,
        method: "POST",
      }),
    }),
    makePeerCall: builder.mutation<string, string>({
      query: (receiverId: string) => ({
        url: `call-logs/call/make-call`,
        method: "POST",
        body: {
          receiverId
        }
      }),
    })
  }),
});

export const {
  useVerifyEmailMutation,
  useCreateThreadMutation,
  useApproveRequestMutation,
  useDeclineRequestMutation,
  useMassUpdateContactsMutation,
  useSendMessageMutation,
  useUpdateUserMutation,
  useEmailChangeReqMutation,
  useEmailChangeReqSubmitMutation,
  useChangePasswordMutation,
  useConnectGoogleAuthMutation,
  useInitializePeerCallMutation,
  useMakePeerCallMutation
} = endpoints;

