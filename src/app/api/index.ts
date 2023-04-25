import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../settings";
import { getLs } from "../lib/helpers/localStorage";
import { apiTags } from "../lib/constants/tags";

const apis = createApi({
  reducerPath: "apis",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // get token from LS
      const token = getLs("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: Object.values(apiTags),
});

export default apis;

