import apis from "../../../app/api";
import { apiTags } from "../../../app/lib/constants/tags";
import { IContact } from "./types";

const endpoints = apis.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<IContact[], void>({
      query: () => "users/contacts",
      providesTags: [apiTags.CONTACTS],
    }),
  }),
});

export const { useGetContactsQuery } = endpoints;

