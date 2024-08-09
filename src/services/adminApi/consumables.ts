import { TBasePaginatedRespose, TRequest } from "definations/auth";

import baseAPI from "..";

const path = "/admins";

export type TConsumables = {
  id: string;
  created_at: string;
  updated_at: string;
  quantity: string;
  stock_control_method: string;
  minimum_stock_level: string;
  expiry_date: string;
  category: string;
  item: string;
};

export type TStockCard = {
  date: string;
  particular: string;
  stock: string;
  status: string;
  consumable: string;
  id: string;
  created_at: string;
  updated_at: string;
  stock_left: string;
};

type TCosumableItem = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  uom: string;
  category: string;
};

const consumablesAPi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getConsumables: builder.query<
      TBasePaginatedRespose<TConsumables[]>,
      TRequest
    >({
      query: (params) => ({
        url: `${path}/inventory-consumables/`,
        params,
      }),
    }),
    createConsumables: builder.mutation<
      TBasePaginatedRespose<TConsumables[]>,
      Partial<TConsumables>
    >({
      query: (body) => ({
        url: `${path}/inventory-consumables/`,
        body,
        method: "POST",
      }),
    }),
    getOneConsumables: builder.query<TConsumables, TRequest>({
      query: (params) => ({
        url: `${path}/inventory-consumables/${params.id}/`,
        params,
      }),
    }),
    deleteConsumables: builder.mutation<
      TBasePaginatedRespose<TConsumables[]>,
      TRequest
    >({
      query: (params) => ({
        url: `${path}/inventory-consumables/${params.id}/`,
        method: "DELETE",
      }),
    }),
    getStockCard: builder.query<TBasePaginatedRespose<TStockCard[]>, TRequest>({
      query: (params) => ({
        url: `${path}/inventory-stock-card/`,
        params,
      }),
      providesTags: ["Stock"],
    }),
    createStockCard: builder.mutation<
      TBasePaginatedRespose<TStockCard[]>,
      Partial<TStockCard>
    >({
      query: (body) => ({
        url: `${path}/inventory-stock-card/`,
        body,
        method: "POST",
      }),
      invalidatesTags: ["Stock"],
    }),
    updateStockCard: builder.mutation<
      TBasePaginatedRespose<TStockCard[]>,
      {
        id: string;
        body: Partial<TStockCard>;
      }
    >({
      query: ({ id, body }) => ({
        url: `${path}/inventory-stock-card/${id}/`,
        body,
        method: "PATCH",
      }),
      invalidatesTags: ["Stock"],
    }),
    deleteStockCard: builder.mutation<
      TBasePaginatedRespose<TStockCard[]>,
      {
        id: string;
      }
    >({
      query: ({ id }) => ({
        url: `${path}/inventory-stock-card/${id}/`,
      
        method: "DELETE",
      }),
      invalidatesTags: ["Stock"],
    }),
    cosumablesItems: builder.query<
      TBasePaginatedRespose<TCosumableItem[]>,
      void
    >({
      query: () => ({
        url: "/config/items/",
      }),
    }),
  }),
});

export const {
  useGetConsumablesQuery,
  useCreateConsumablesMutation,
  useCreateStockCardMutation,
  useDeleteConsumablesMutation,
  useGetOneConsumablesQuery,
  useGetStockCardQuery,
  useCosumablesItemsQuery,
  useUpdateStockCardMutation,
  useDeleteStockCardMutation
} = consumablesAPi;
