import baseAPI from "services/index";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    IFacilitatorPaginatedData,
    IFacilitatorSingleData,
    TFacilitatorManagementDetailsFormData,
    TFacilitatorScopeOfWorkFormData,
} from "definations/c&g/contract-management/facilitator-management";

const BASE_URL = "/contract-grants/facilitators/";

const FacilitatorManagementAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createFacilitator: builder.mutation<
            TResponse<IFacilitatorSingleData>,
            TFacilitatorManagementDetailsFormData &
                TFacilitatorScopeOfWorkFormData
        >({
            query: (body) => ({
                method: "POST",
                url: BASE_URL,
                body,
            }),
            invalidatesTags: ["FACILITATOR_MANAGEMENT"],
        }),

        getAllFacilitators: builder.query<
            TPaginatedResponse<IFacilitatorPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: BASE_URL,
                params,
            }),
            providesTags: ["FACILITATOR_MANAGEMENT"],
        }),

        getSingleFacilitator: builder.query<
            TResponse<IFacilitatorSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}/`,
            }),
            providesTags: ["FACILITATOR_MANAGEMENT"],
        }),

        modifyFacilitator: builder.mutation<
            TPaginatedResponse<IFacilitatorSingleData>,
            {
                id: string;
                body: TFacilitatorManagementDetailsFormData &
                    TFacilitatorScopeOfWorkFormData;
            }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["FACILITATOR_MANAGEMENT"],
        }),

        deleteFacilitator: builder.mutation<
            TResponse<IFacilitatorSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}/`,
            }),
            invalidatesTags: ["FACILITATOR_MANAGEMENT"],
        }),
    }),
});

export const {
    useCreateFacilitatorMutation,
    useGetAllFacilitatorsQuery,
    useGetSingleFacilitatorQuery,
    useModifyFacilitatorMutation,
    useDeleteFacilitatorMutation,
} = FacilitatorManagementAPI;
