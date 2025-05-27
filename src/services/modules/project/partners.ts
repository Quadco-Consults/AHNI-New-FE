import { TPaginatedResponse, TRequest } from "definations/index";
import baseAPI from "../..";
import {
    TPartnerData,
    TPartnerFormValues,
} from "definations/modules/project/partners";

const PartnerAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllPartners: builder.query<
            TPaginatedResponse<TPartnerData>,
            TRequest & { state?: string; partner_type?: string }
        >({
            query: (params) => ({
                url: "/projects/partners/",
                params,
            }),
            providesTags: ["Partners"],
        }),

        addPartner: builder.mutation<TPartnerData, TPartnerFormValues>({
            query: (body) => ({
                url: "/projects/partners/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Partners"],
        }),

        updatePartner: builder.mutation<
            TPartnerData,
            { id: string; body: TPartnerFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/projects/partners/${id}/`,
                method: "PUT",
                body: body,
            }),
            invalidatesTags: ["Partners"],
        }),

        deletePartner: builder.mutation<TPartnerData, string>({
            query: (id) => ({
                url: `/projects/partners/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Partners"],
        }),
    }),
});

export const {
    useGetAllPartnersQuery,
    useAddPartnerMutation,
    useUpdatePartnerMutation,
    useDeletePartnerMutation,
} = PartnerAPI;
