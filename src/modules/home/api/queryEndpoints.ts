import apis from "../../../app/api";
import { apiTags } from "../../../app/lib/constants/tags";
import { IContact, IInbox } from "./types";

const endpoints = apis.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<IContact[], void>({
      query: () => "users/contacts",
      providesTags: [apiTags.CONTACTS],
    }),
    getRequests: builder.query<IInbox, void>({
      query: () =>
        "inbox?join=threads&join=threads.messages&join=threads.users&sort=threads.messages.createdAt,DESC&filter=threads.type||eq||Request",
    }),
    getInbox: builder.query<IInbox, void>({
      query: () =>
        "inbox?join=threads&join=threads.messages&join=threads.users&sort=threads.messages.createdAt,DESC&filter=threads.type||ne||Request",
    }),
  }),
});

export const {
  useGetContactsQuery,
  useLazyGetRequestsQuery,
  useGetInboxQuery,
} = endpoints;
