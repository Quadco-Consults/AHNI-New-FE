import { TBaseCreateResponse, TBasePaginatedResponse } from "definations/auth";
import baseAPI from "..";
import { HrGradeFormValues } from "definations/hr-validator";
import { HrGradeResults } from "definations/hr-types/hr-grades";

const BASE_URL = "/hr/hr-positions/";

const HrPositionAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getHrPositions: builder.query<TBasePaginatedResponse<HrGradeResults[]>, {}>(
      {
        query: (config) => {
          return {
            url: `${BASE_URL}`,
            ...config,
          };
        },
        providesTags: ["HR_GRADE"],
      }
    ),
    getHrPositionList: builder.query<HrGradeResults[], {}>({
      query: (config) => {
        return {
          url: `${BASE_URL}`,
          ...config,
        };
      },
      providesTags: ["HR_GRADE"],
    }),
    getHrPosition: builder.query<HrGradeResults, { path: { id: string } }>({
      query: ({ path }) => {
        return {
          url: `${BASE_URL}${path.id}/`,
        };
      },
      providesTags: ["HR_GRADE"],
    }),
    createHrPosition: builder.mutation<
      TBaseCreateResponse<HrGradeResults>,
      HrGradeFormValues
    >({
      query: (body) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["HR_GRADE"],
    }),
    updateHrPosition: builder.mutation<
      TBaseCreateResponse<HrGradeResults>,
      { path: { id: string }; body: { name: string } }
    >({
      query: ({ path, body }) => ({
        url: `${BASE_URL}${path.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["HR_GRADE"],
    }),
  }),
});

export default HrPositionAPI;
