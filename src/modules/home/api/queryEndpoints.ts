import apis from "../../../app/api";
import { apiTags } from "../../../app/lib/constants/tags";
import { IChatRequest, IContact, IInbox } from "./types";

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
    getInbox: builder.query<IInbox, void>({
      query: () =>
        "inbox?join=threads&join=threads.messages&join=threads.users&sort=threads.messages.createdAt,DESC",
    }),
    getConversation: builder.query<IInbox, string>({
      query: (recipientId) => `inbox/${recipientId}`,
    }),
  }),
});

export const {
  useGetContactsQuery,
  useLazyGetChatRequestsQuery,
  useLazyGetConversationQuery,
  useGetChatRequestsQuery,
  useGetInboxQuery,
} = endpoints;

