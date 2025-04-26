/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import {
  LocationData,
  LocationResponse,
  LocationResultsData,
} from "definations/configs/location"; 

const BASE_URL = "/config/locations/";

const LocationAPi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getLocation: builder.query<LocationData, {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("LOCATION", data) : [],
    }),
    getLocationList: builder.query<LocationResultsData[], {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: (data, error) =>
        !error ? provideTags("LOCATION", data) : [],
    }),
 
  }),
});

export const { 
  useGetLocationListQuery,
  useGetLocationQuery, 
} = LocationAPi;
