import apis from "../../../app/api";
import { apiTags } from "../../../app/lib/constants/tags";
import { IChatRequest, IContact } from "./types";

const endpoints = apis.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<IContact[], void>({
      query: () => "users/contacts",
      providesTags: [apiTags.CONTACTS],
    }),
    getChatRequests: builder.query<IChatRequest[], void>({
      query: () => "users/chat-requests/received",
    }),
  }),
});

export const { useGetContactsQuery, useLazyGetChatRequestsQuery } = endpoints;

