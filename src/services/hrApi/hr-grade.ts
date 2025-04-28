
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "..";
import { HrGradeFormValues } from "definations/hr-validator";
import { HrGradeResults } from "definations/hr-types/hr-grades";

const BASE_URL = "/hr/hr-grades/";

const HrGradeAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getHrGrades: builder.query<
        TPaginatedResponse<HrGradeResults[]>,
        TRequest
        >({
            query: (config) => {
                return {
                    url: `${BASE_URL}`,
                    ...config,
                };
            },
            providesTags: ["HR_GRADE"],
        }),
        getHrGradeList: builder.query<HrGradeResults[], {}>({
            query: (config) => {
                return {
                    url: `${BASE_URL}`,
                    ...config,
                };
            },
            providesTags: ["HR_GRADE"],
        }),
        getHrGrade: builder.query<HrGradeResults, { path: { id: string } }>({
            query: ({ path }) => {
                return {
                    url: `${BASE_URL}${path.id}/`,
                };
            },
            providesTags: ["HR_GRADE"],
        }),
        createHrGrade: builder.mutation<
        TResponse<HrGradeResults>,
            HrGradeFormValues
        >({
            query: (body) => ({
                url: `${BASE_URL}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["HR_GRADE"],
        }),
        updateHrGrade: builder.mutation<
            TResponse<HrGradeResults>,
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

export const {
    useCreateHrGradeMutation,
    useGetHrGradeListQuery,
    useGetHrGradeQuery,
    useGetHrGradesQuery,
    useUpdateHrGradeMutation
} = HrGradeAPI;
