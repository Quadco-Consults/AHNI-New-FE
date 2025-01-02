import { TBasePaginatedResponse } from "definations/auth";
import baseAPI from "..";
import { ProcurementTrackerResults } from "definations/procurement-types/procurementPlan";

const BASE_URL = "/procurements/procurement-tracker/";

const ProcurementTrackerAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProcurementTrackers: builder.query<
      TBasePaginatedResponse<ProcurementTrackerResults[]>,
      {}
    >({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: ["PROCUREMENT_TRACKER"],
    }),
  }),
});

export default ProcurementTrackerAPI;
