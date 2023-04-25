import apis from "../../../app/api";
import { apiTags } from "../../../app/lib/constants/tags";
import { IUser } from "../../auth/control/types";
import { IChatRequest, IChatRequestPayload, IVerifyEmail } from "./types";

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
      invalidatesTags: [apiTags.CONTACTS],
    }),
  }),
});

export const { useVerifyEmailMutation, useSendChatRequestMutation } = endpoints;

