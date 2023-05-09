import apis from "../../../app/api";
import { apiTags } from "../../../app/lib/constants/tags";
import { IChatRequest, IContact, IMessage } from "./types";

const endpoints = apis.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<IContact[], void>({
      query: () => "users/contacts",
      providesTags: [apiTags.CONTACTS],
    }),
    getChatRequests: builder.query<IChatRequest[], void>({
      query: () => "users/chat-requests/received",
      providesTags: [apiTags.CHAT_REQUESTS],
    }),
    getShallowInbox: builder.query<IMessage[], void>({
      query: () => "inbox/shallow",
      providesTags: [apiTags.INBOX],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useLazyGetChatRequestsQuery,
  useLazyGetShallowInboxQuery,
} = endpoints;

