import { TBasePaginatedRespose, TRequest } from "definations/auth";

import baseAPI from "..";
import { omit } from "lodash";

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

type TAssets = {
  id: string;
  created_at: string;
  updated_at: string;
  asset_code: string;
  serial_number: string;
  assignee: string;
  date_of_acquisition: string;
  state: string;
  location: string;
  estimated_life_span: string;
  classification: string;
  cost_in_usd: string;
  cost_in_ngn: string;
  unit: string;
  implementer: string;
  asset_type: string;
  asset_condition: string;
  name: string;
};

interface Implementer {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
}

interface Location {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  address: string;
  city: string | null;
  state: string;
  email: string | null;
  phone: string | null;
}

interface AssetType {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  manufacturer: string;
  model: string;
}

interface AssetCondition {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
}

interface Asset {
  id: string;
  implementer: Implementer;
  location: Location;
  asset_type: AssetType;
  asset_condition: AssetCondition;
  created_at: string;
  updated_at: string;
  asset_code: string;
  serial_number: string | null;
  assignee: string;
  date_of_acquisition: string;
  state: string;
  estimated_life_span: string;
  classification: string;
  cost_in_usd: string;
  cost_in_ngn: string;
  unit: string;
}
interface AssetActionPayload {
  remark: string;
  justification_for_disposal: string;
  life_span_at_report: string;
  recommendation: string;
  asset_condition_id: string; // UUID format
  assets: string[]; // Array of UUIDs
}

export interface DisposalReport {
  id: string;
  created_at: string;
  updated_at: string;
  remark: string;
  justification_for_disposal: string;
  life_span_at_report: number;
  recommendation: string;
  asset_condition: string;
  assets: string[];
}

const assetsAPi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<TBasePaginatedRespose<Asset[]>, TRequest>({
      query: (params) => ({
        url: `${path}/inventory-assets/`,
        params,
      }),
    }),
    getAssetsRequest: builder.query<
      TBasePaginatedRespose<DisposalReport[]>,
      TRequest
    >({
      query: (params) => ({
        url: `${path}/inventory-asset-actions/`,
        params,
      }),
      providesTags: ["AssetsRequest"],
    }),
    createAssets: builder.mutation<TAssets, Partial<TAssets>>({
      query: (body) => ({
        url: `${path}/inventory-assets/`,
        body,
        method: "POST",
      }),
    }),
    getOneAssets: builder.query<Asset, TRequest>({
      query: (params) => ({
        url: `${path}/inventory-assets/${params.id}/`,
        params: {
          ...omit(params, "id"),
        },
      }),
    }),
    getOneAssetsRequest: builder.query<DisposalReport, TRequest>({
      query: (params) => ({
        url: `${path}/inventory-asset-actions/${params.id}/`,
        params: {
          ...omit(params, "id"),
        },
      }),
    }),
    updateAssets: builder.query<
      TAssets,
      {
        id: string;
        body: Partial<TAssets>;
      }
    >({
      query: ({ id, body }) => ({
        url: `${path}/inventory-assets/${id}/`,
        method: "PATCH",
        body,
      }),
    }),
    deleteAssets: builder.mutation<
      TBasePaginatedRespose<TConsumables[]>,
      TRequest
    >({
      query: (params) => ({
        url: `${path}/inventory-assets/${params.id}/`,
        method: "DELETE",
      }),
    }),
    deleteAssetsRequest: builder.mutation<
      TBasePaginatedRespose<TConsumables[]>,
      TRequest
    >({
      query: (params) => ({
        url: `${path}/inventory-asset-actions/${params.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AssetsRequest"],
    }),
    getAssetType: builder.query<TBasePaginatedRespose<TAssets[]>, TRequest>({
      query: (params) => ({
        url: `${path}/inventory-asset-types/`,
        params,
      }),
    }),
    getAssetConditions: builder.query<
      TBasePaginatedRespose<AssetCondition[]>,
      TRequest
    >({
      query: (params) => ({
        url: `${path}/inventory-asset-conditions/`,
        params,
      }),
    }),
    createAssetActions: builder.mutation<any, AssetActionPayload>({
      query: (body) => ({
        url: `${path}/inventory-asset-actions/`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetOneAssetsQuery,
  useCreateAssetsMutation,
  useDeleteAssetsMutation,
  useGetAssetTypeQuery,
  useGetAssetConditionsQuery,
  useCreateAssetActionsMutation,
  useGetAssetsRequestQuery,
  useDeleteAssetsRequestMutation,
  useGetOneAssetsRequestQuery,
} = assetsAPi;
