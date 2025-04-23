import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../settings";
import { getLs, setLS } from "../lib/helpers/localStorage";
import { apiTags } from "../lib/constants/tags";
import { clearLs } from "../lib/helpers/localStorage";
import { paths } from "../../utils/paths";
import { lsKeys } from "../lib/constants/localStorageKeys";


const apis = createApi({
  reducerPath: "apis",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      if (!headers.get("authorization")) {
        // get token from LS
        const token = getLs("token");
        if (token) headers.set("authorization", `Bearer ${token}`);
        return headers;
      }
    },
    validateStatus: (response) => {
      if (response.status === 401) {
        // Clear token and redirect to login
        clearLs("token");
        // Set session expired flag in localStorage
        setLS(lsKeys.SESSION_EXPIRED, "true")
        window.location.href = paths.login;
        return false;
      }
      return response.status >= 200 && response.status <= 299;
    }
  }),
  endpoints: () => ({}),
  tagTypes: Object.values(apiTags),
});

export default apis;

