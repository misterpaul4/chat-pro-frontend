import apis from "../../../app/api";
import { IContact } from "./types";

const endpoints = apis.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<IContact[], void>({
      query: () => "users/contacts",
    }),
  }),
});

export const { useGetContactsQuery } = endpoints;

