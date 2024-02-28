import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { StoreQueryTagEnum } from "constants/StoreConstants";
import CoreHttp from "./HttpConfig";
import { EnvVarEnum } from "constants/Global";
import { TenantConfig } from "./TenantConfig";

export const CoreApi = createApi({
  reducerPath: "esoE",
  baseQuery: axiosBaseQuery(
    { url: "/fineract-service/api/v1", method: "post" },
    CoreHttp
  ),
  endpoints: (builder) => ({
    getTenant: builder.query({
      queryFn: (_, { getState }, ___, baseQuery) => {
        return { data: { data: TenantConfig[EnvVarEnum.CORE_API_BASE_URL] } };
      },
    }),
  }),
});

export const DocumentServiceApi = createApi({
  reducerPath: "document-service",
  baseQuery: axiosBaseQuery({
    url: EnvVarEnum.CORE_API_BASE_URL + "/document-service/api/v1",
  }),
  endpoints: () => ({}),
});

[CoreApi].forEach((api) => {
  api.enhanceEndpoints({ addTagTypes: Object.values(StoreQueryTagEnum) });
});

/**
 *
 * @param {import("axios").AxiosRequestConfig} baseConfig
 */
export function axiosBaseQuery(baseConfig = {}, http = axios) {
  return request;

  /**
   *
   * @param {import("axios").AxiosRequestConfig} config
   */
  async function request(config = {}) {
    const url = config.url
      ? (baseConfig.url || "") + config.url
      : baseConfig.url;
    const data = config.body || config.data || baseConfig.data;
    try {
      const response = await http.request({
        ...baseConfig,
        ...config,
        url,
        data,
      });

      return {
        ...response,
        data: response.data,
        message: response.data?.defaultUserMessage || null,
        defaultUserMessage: response.data?.defaultUserMessage || null,
        status: response.status || 200,
        meta: { request: response.request, response },
      };
    } catch (error) {
      return {
        error: error.response
          ? {
              defaultUserMessage:
                error.response.data?.errors?.[0]?.defaultUserMessage ||
                error.response.data?.defaultUserMessage,
              message:
                error.response.data?.errors?.[0]?.defaultUserMessage ||
                error.response.data?.defaultUserMessage,
              status: error.response.status,
              data: error.response.data,
            }
          : {
              defaultUserMessage: "Something went wrong",
              data: { defaultUserMessage: "Something went wrong" },
            },
        meta: {
          request: error.response.request,
          response: error.response,
        },
      };
    }
  }
}
