import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../settings";
import { getLs, setLS } from "../lib/helpers/localStorage";
import { apiTags } from "../lib/constants/tags";
import { clearLs } from "../lib/helpers/localStorage";
import { paths, isAuthPath } from "../../utils/paths";
import { lsKeys } from "../lib/constants/localStorageKeys";

const isSuccessStatus = (status: number) => {
  // 1xx: Informational responses
  // 2xx: Success responses
  // 3xx: Redirection messages
  return (status >= 100 && status < 400) || status === 404;
};

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
      if (response.status === 401 && !isAuthPath(window.location.pathname)) {
        // Clear token and redirect to login
        clearLs("token");
        // Set session expired flag in localStorage
        setLS(lsKeys.SESSION_EXPIRED, "true")
        window.location.href = paths.login;
        return false;
      }

      return isSuccessStatus(response.status);
    }
  }),
  endpoints: () => ({}),
  tagTypes: Object.values(apiTags),
});

export default apis;

