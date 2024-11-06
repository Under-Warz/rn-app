import { E_MEDIA_VISIBILITY_STATE, Media } from "@/app/technical/types";
import { dynamicBaseQuery } from "@/app/technical/utils/dynamicBaseQuery";
import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  createApi,
} from "@reduxjs/toolkit/query/react";
import {
  CreateMediaBody,
  CreateMediaResponse,
  GetTokenResponse,
  GetUniqueTokenBody,
  GetUniqueTokenResponse,
  UpdateMediaBody,
  UpdateMediaResponse,
  UploadMediaBody,
  UploadMediaResponse,
} from "./streamlike.types";
import axios from "axios";
import { setUploadProgress } from "@/features/upload/state/upload.slice";
import type { RootState } from "@/app/store";
import {
  BaseQueryApi,
  QueryReturnValue,
} from "@reduxjs/toolkit/dist/query/baseQueryTypes";

type QueryFn<out Result, in UploadMediaBody> = (
  arg: UploadMediaBody,
  api: BaseQueryApi
) => Promise<QueryReturnValue<Result, FetchBaseQueryError, FetchBaseQueryMeta>>;

// TODO: use axios in dynamicBaseQuery
const uploadMediaQueryFn: QueryFn<Media, UploadMediaBody> = async (
  args,
  api
) => {
  try {
    const state = api.getState() as RootState;
    const token = state.auth.token;
    const apiHostname = state.auth.apiHostname;

    const result = await axios.post(`/medias/${args.id}`, args.formData, {
      baseURL: `https://${apiHostname}`,
      headers: {
        "X-Streamlike-Authorization": `streamlikeAuth token="${token}"`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (upload) => {
        //Set the progress value to show the progress bar
        let progress = Math.round((100 * upload.loaded) / upload.total);
        api.dispatch(setUploadProgress(progress));
      },
    });

    return { data: result.data };
  } catch (e) {
    return {
      error: {
        status: e.response?.status,
        data: e.response?.data || e.message,
      },
    };
  }
};

export const streamlikeApi = createApi({
  reducerPath: "api",
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    getUniqueToken: builder.mutation<
      GetUniqueTokenResponse,
      GetUniqueTokenBody
    >({
      query: ({ apiHostname, ...body }) => ({
        url: `https://${apiHostname}/authent/token/unique`,
        method: "POST",
        body,
      }),
      extraOptions: {
        maxRetries: 0,
      },
    }),
    getToken: builder.mutation<GetTokenResponse, void>({
      query: () => ({
        url: "/authent/token/session",
        method: "POST",
      }),
      extraOptions: {
        maxRetries: 0,
      },
    }),
    createMedia: builder.mutation<CreateMediaResponse, CreateMediaBody>({
      query: (body) => ({
        url: "/medias",
        method: "POST",
        body: {
          ...body,
          visibility: {
            state: E_MEDIA_VISIBILITY_STATE.ONLINE,
          },
        },
      }),
    }),
    uploadMedia: builder.mutation<UploadMediaResponse, UploadMediaBody>({
      queryFn: uploadMediaQueryFn,
    }),
    updateMedia: builder.mutation<UpdateMediaResponse, UpdateMediaBody>({
      query: ({ id, ...body }) => ({
        url: `/medias/${id}`,
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useGetUniqueTokenMutation,
  useGetTokenMutation,
  useCreateMediaMutation,
  useUploadMediaMutation,
  useUpdateMediaMutation,
} = streamlikeApi;
