import baseAPI from ".";
import { TBasePaginatedRespose, TRequest, TFacilityResponseArray, TSupervisionCategoryResponseArray } from "definations/auth";
import { Facilities, 
    TFacilities, 
    TSupervisionCategory, 
    SupervisionCategory,
    TRiskCategory,
    RiskCategory 
} from "definations/module-programs";

const projectsAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        facilities: builder.query<TFacilityResponseArray<Facilities[]>, TRequest>({
            query: (params) => ({
                url: "/programs/facilities/",
                params,
            }),
            providesTags: ["Facilities"],
        }),
        addFacilities: builder.mutation<Facilities, TFacilities>({
            query: (body) => ({
                url: "/programs/facilities/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Facilities"],
        }),
        states: builder.query({
            query: (params) => ({
                url: "/config/states/",
                params,
            }),
        }),

        supervisionCategory: builder.query<TSupervisionCategoryResponseArray, TRequest>({
            query: (params) => ({
                url: "/programs/evaluation-categories/",
                params,
            }),
            providesTags: ["SupervisionCategory"],
        }),
        addSupervisionCategory: builder.mutation<SupervisionCategory, TSupervisionCategory>({
            query: (body) => ({
                url: "/programs/evaluation-categories/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["SupervisionCategory"],
        }),

        riskCategory: builder.query<TBasePaginatedRespose<RiskCategory[]>, TRequest>({
            query: (params) => ({
                url: "/programs/risk-categories/",
                params,
            }),
            providesTags: ["RiskCategory"],
        }),
        addRiskCategory: builder.mutation<RiskCategory, TRiskCategory>({
            query: (body) => ({
                url: "/programs/risk-categories/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["RiskCategory"],
        }),

    }),
});

export const {
    useFacilitiesQuery,
    useAddFacilitiesMutation,
    useStatesQuery,
    useSupervisionCategoryQuery,
    useAddSupervisionCategoryMutation,
    useRiskCategoryQuery,
    useAddRiskCategoryMutation
} = projectsAPI