import apis from "../../../app/api";
import { apiTags } from "../../../app/lib/constants/tags";
import { IChatRequest, IContact, IInbox, IMessage } from "./types";

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
    }),
    getAllInbox: builder.query<IInbox, void>({
      query: () => "inbox?join=sender&join=receiver&sort=createdAt,DESC",
    }),
    getConversation: builder.query<IInbox, string>({
      query: (recipientId) => `inbox/${recipientId}`,
    }),
  }),
});

export const {
  useGetContactsQuery,
  useLazyGetChatRequestsQuery,
  useLazyGetShallowInboxQuery,
  useLazyGetAllInboxQuery,
  useLazyGetConversationQuery,
} = endpoints;

