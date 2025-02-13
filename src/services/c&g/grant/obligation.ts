import {
    IObligationPaginatedData,
    IObligationSingleData,
    TObligationFormData,
} from "definations/c&g/grants";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "services/index";

const ObligationAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createObligation: builder.mutation<
            TResponse<IObligationSingleData>,
            { grantId: string; body: TObligationFormData }
        >({
            query: ({ grantId, body }) => ({
                method: "POST",
                url: `/contract-grants/grants/${grantId}/obligations/`,
                body,
            }),
            invalidatesTags: ["OBLIGATION", "GRANT"],
        }),

        getAllObligations: builder.query<
            TPaginatedResponse<IObligationPaginatedData>,
            TRequest & { grantId: string }
        >({
            query: ({ grantId, ...rest }) => ({
                method: "GET",
                url: `/contract-grants/grants/${grantId}/obligations/`,
                params: { ...rest },
            }),
            providesTags: ["OBLIGATION"],
        }),

        modifyObligation: builder.mutation<
            TResponse<IObligationSingleData>,
            { grantId: string; obligationId: string; body: TObligationFormData }
        >({
            query: ({ grantId, obligationId, body }) => ({
                method: "PUT",
                url: `/contract-grants/grants/${grantId}/obligations/${obligationId}/`,
                body,
            }),
            invalidatesTags: ["OBLIGATION", "GRANT"],
        }),

        deleteObligation: builder.mutation<
            TResponse<IObligationSingleData>,
            { grantId: string; obligationId: string }
        >({
            query: ({ grantId, obligationId }) => ({
                method: "DELETE",
                url: `/contract-grants/grants/${grantId}/obligations/${obligationId}/`,
            }),
            invalidatesTags: ["OBLIGATION", "GRANT"],
        }),
    }),
});

export const {
    useCreateObligationMutation,
    useGetAllObligationsQuery,
    useModifyObligationMutation,
    useDeleteObligationMutation,
} = ObligationAPI;
