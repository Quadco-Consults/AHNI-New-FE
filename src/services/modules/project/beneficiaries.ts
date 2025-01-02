import { TPaginatedResponse, TRequest } from "definations/index";
import baseAPI from "../..";
import {
    TBeneficiaryData,
    TBeneficiaryFormValues,
} from "definations/modules/project/beneficiaries";

const projectsAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllBeneficiary: builder.query<
            TPaginatedResponse<TBeneficiaryData>,
            TRequest
        >({
            query: (params) => ({
                url: "/projects/beneficiaries/",
                params,
            }),
            providesTags: ["Beneficiaries"],
        }),

        addBeneficiary: builder.mutation<
            TBeneficiaryData,
            TBeneficiaryFormValues
        >({
            query: (body) => ({
                url: "/projects/beneficiaries/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Beneficiaries"],
        }),

        updateBeneficiary: builder.mutation<
            TBeneficiaryData,
            { id: string; body: TBeneficiaryFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/projects/beneficiaries/${id}/`,
                method: "PUT",
                body: body,
            }),
            invalidatesTags: ["Beneficiaries"],
        }),

        deleteBeneficiary: builder.mutation<TBeneficiaryData, string>({
            query: (id) => ({
                url: `/projects/beneficiaries/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Beneficiaries"],
        }),
    }),
});

export const {
    useGetAllBeneficiaryQuery,
    useAddBeneficiaryMutation,
    useUpdateBeneficiaryMutation,
    useDeleteBeneficiaryMutation,
} = projectsAPI;
