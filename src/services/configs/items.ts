/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import baseAPI from "..";
import { z } from "zod";
import {
  ItemsData,
  ItemsResponse,
  ItemsResultsData,
} from "definations/configs/itmes";

const BASE_URL = "/config/items/";

const ItemsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<ItemsData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: ["ITEMS"],
    }),
    getItemList: builder.query<ItemsResultsData[], {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: ["ITEMS"],
    }),

    createItem: builder.mutation<ItemsResponse, any>({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ITEMS"],
    }),

    getItem: builder.query<ItemsResultsData, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: ["ITEMS"],
    }),

    updateItem: builder.mutation<
      ItemsResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ITEMS"],
    }),

    modifyItem: builder.mutation<
      ItemsResponse,
      { path: { id: string }; body: any }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ITEMS"],
    }),

    deleteItem: builder.mutation<void, { path: { id: string } }>({
      query: ({ path }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ITEMS"],
    }),
  }),
});

export default ItemsAPI;
