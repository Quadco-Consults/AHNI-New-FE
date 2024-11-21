import baseAPI from ".";
import {
    TBasePaginatedResponse,
    TRequest,
    TSupervisionCategoryResponse,
    TSupervisionCategoryResponseArray,
} from "definations/auth";
import {
    Facilities,
    TFacilities,
    TSupervisionCategory,
    SupervisionCategory,
    TRiskCategory,
    RiskCategory,
    SupervisionCriteria,
    TSupervisionCriteria,
} from "definations/module-programs";

type TFacilityContact = {
    id: string;
    name: string;
    position: string;
    phone_number: string;
    email: string;
    facility: string;
};

export type Facility = {
    id: string;
    name: string;
    state: string;
    lga: string;
    address: string;
    contact_person: string;
    email: string;
    postion: string;
    phone: string;
    facility_contacts: TFacilityContact[];
};

const projectsAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        facilities: builder.query<TBasePaginatedResponse<Facility>, TRequest>({
            query: (params) => ({
                url: "/programs/facility/",
                params,
            }),
            providesTags: ["Facilities"],
        }),
        addFacilities: builder.mutation<Facilities, TFacilities>({
            query: (body) => ({
                url: "/programs/facility/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Facilities"],
        }),
        updateFacilities: builder.mutation<
            Facilities,
            { id: string; body: TFacilities }
        >({
            query: ({ id, body }) => ({
                url: `/programs/facility/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Facilities"],
        }),
        deleteFacilities: builder.mutation<Facilities, string>({
            query: (id) => ({
                url: `/programs/facility/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Facilities"],
        }),
        states: builder.query({
            query: (params) => ({
                url: "/config/states/",
                params,
            }),
        }),

        supervisionCategory: builder.query<
            TBasePaginatedResponse<TSupervisionCategoryResponse>,
            TRequest
        >({
            query: (params) => ({
                url: "/programs/supervision-evaluation-category/",
                params,
            }),
            providesTags: ["SupervisionCategory"],
        }),

        addSupervisionCategory: builder.mutation<
            SupervisionCategory,
            TSupervisionCategory
        >({
            query: (body) => ({
                url: "/programs/supervision-evaluation-category/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["SupervisionCategory"],
        }),
        updateSupervisionCategory: builder.mutation<
            TSupervisionCategoryResponseArray,
            { id: string; body: TSupervisionCategory }
        >({
            query: ({ id, body }) => ({
                url: `/programs/supervision-evaluation-category/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["SupervisionCategory"],
        }),
        deleteSupervisionCategory: builder.mutation<
            TSupervisionCategoryResponseArray,
            string
        >({
            query: (id) => ({
                url: `/programs/supervision-evaluation-category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SupervisionCategory"],
        }),

        riskCategory: builder.query<
            TBasePaginatedResponse<RiskCategory>,
            TRequest
        >({
            query: (params) => ({
                url: "/programs/risk-category/",
                params,
            }),
            providesTags: ["RiskCategory"],
        }),
        addRiskCategory: builder.mutation<RiskCategory, TRiskCategory>({
            query: (body) => ({
                url: "/programs/risk-category/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["RiskCategory"],
        }),
        updateRiskCategory: builder.mutation<
            RiskCategory,
            { id: string; body: TRiskCategory }
        >({
            query: ({ id, body }) => ({
                url: `/programs/risk-category/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["RiskCategory"],
        }),
        deleteRiskCategory: builder.mutation<RiskCategory, string>({
            query: (id) => ({
                url: `/programs/risk-category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["RiskCategory"],
        }),

        getSupervisionCriteria: builder.query<
            TBasePaginatedResponse<SupervisionCriteria>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/programs/supervision-evaluation-criteria/",
                params,
            }),
            providesTags: ["SupervisionCriteria"],
        }),

        addSupervisionCriteria: builder.mutation<
            SupervisionCriteria,
            TSupervisionCriteria
        >({
            query: (body) => ({
                method: "POST",
                url: "/programs/supervision-evaluation-criteria/",
                body,
            }),
            invalidatesTags: ["SupervisionCriteria"],
        }),

        updateSupervisionCriteria: builder.mutation<
            SupervisionCriteria,
            { id: number; body: TSupervisionCriteria }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/programs/supervision-evaluation-criteria/${id}/`,
                body,
            }),
            invalidatesTags: ["SupervisionCriteria"],
        }),

        deleteSupervisionCriteria: builder.mutation<
            SupervisionCriteria,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `/programs/supervision-evaluation-criteria/${id}/`,
            }),
            invalidatesTags: ["SupervisionCriteria"],
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
    useAddRiskCategoryMutation,
    useDeleteRiskCategoryMutation,
    useUpdateRiskCategoryMutation,
    useDeleteSupervisionCategoryMutation,
    useUpdateSupervisionCategoryMutation,
    useDeleteFacilitiesMutation,
    useUpdateFacilitiesMutation,
    useGetSupervisionCriteriaQuery,
    useAddSupervisionCriteriaMutation,
    useUpdateSupervisionCriteriaMutation,
    useDeleteSupervisionCriteriaMutation,
} = projectsAPI;
