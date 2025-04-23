import apis from "../../../app/api";
import { apiTags } from "../../../app/lib/constants/tags";
import { $onlineStatus, ICallLog, IContact, IInbox } from "./types";

const endpoints = apis.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<IContact[], void>({
      query: () => "users/contacts",
      providesTags: [apiTags.CONTACTS],
    }),
    getRequests: builder.query<IInbox, string>({
      query: (userId) =>
        `inbox?join=threads&join=threads.messages&join=threads.users&sort=threads.messages.createdAt,DESC&filter=threads.type||eq||Request&filter=threads.createdBy||ne||${userId}`,
    }),
    getInbox: builder.query<IInbox, string>({
      query: (userId) =>
        `inbox?join=threads&join=threads.messages&join=threads.users&sort=threads.messages.createdAt,DESC&filter=threads.type||ne||Request&or=threads.createdBy||eq||${userId}`,
    }),
    getOnlineContacts: builder.query<string[], void>({
      query: () => "users/online-contacts",
    }),
    getCallHistory: builder.query<ICallLog, void>({
      query: () => "call-logs?sort=createdAt,DESC&join=callFrom||firstName,lastName&join=callTo||firstName,lastName",
      providesTags: [apiTags.CALL_HISTORY],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useLazyGetRequestsQuery,
  useLazyGetInboxQuery,
  useGetOnlineContactsQuery,
  useGetCallHistoryQuery
} = endpoints;

