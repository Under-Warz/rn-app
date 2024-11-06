import Config from "@/app/config";
import type { RootState } from "@/app/store";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  retry,
} from "@reduxjs/toolkit/dist/query";

const rawBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: `https://${Config.apiHostname}`,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set(
          "X-Streamlike-Authorization",
          `streamlikeAuth token="${token}"`
        );
      }
      return headers;
    },
  }),
  {
    maxRetries: 5,
  }
);

export const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const apiHostname = (api.getState() as RootState).auth.apiHostname;

  let adjustedArgs = args;
  if (apiHostname && typeof adjustedArgs !== "string") {
    adjustedArgs = {
      ...adjustedArgs,
      url: `https://${apiHostname}` + adjustedArgs.url,
    };
  }

  // provide the amended url and other params to the raw base query
  return rawBaseQuery(args, api, extraOptions);
};
