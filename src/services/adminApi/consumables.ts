import { TBasePaginatedResponse, TRequest } from "definations/auth";

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
      TBasePaginatedResponse<TConsumables[]>,
      TRequest
    >({
      query: (params) => ({
        url: `${path}/inventory-consumables/`,
        params,
      }),
    }),
    createConsumables: builder.mutation<
      TBasePaginatedResponse<TConsumables[]>,
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
      TBasePaginatedResponse<TConsumables[]>,
      TRequest
    >({
      query: (params) => ({
        url: `${path}/inventory-consumables/${params.id}/`,
        method: "DELETE",
      }),
    }),
    getStockCard: builder.query<TBasePaginatedResponse<TStockCard[]>, TRequest>(
      {
        query: (params) => ({
          url: `${path}/inventory-stock-card/`,
          params,
        }),
        providesTags: ["Stock"],
      }
    ),
    createStockCard: builder.mutation<
      TBasePaginatedResponse<TStockCard[]>,
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
      TBasePaginatedResponse<TStockCard[]>,
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
      TBasePaginatedResponse<TStockCard[]>,
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
      TBasePaginatedResponse<TCosumableItem[]>,
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
  useDeleteStockCardMutation,
} = consumablesAPi;
