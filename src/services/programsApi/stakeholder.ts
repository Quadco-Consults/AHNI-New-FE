import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "..";
import {
    TStakeholderRegisterData,
    TStakeholderRegisterFormValues,
} from "definations/program-validator";

const stakeholderAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createStakeholderRegister: builder.mutation<
            TResponse<TStakeholderRegisterData>,
            TStakeholderRegisterFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: "/programs/stakeholders/",
                body,
            }),
            invalidatesTags: ["STAKEHOLDER_REGISTER"],
        }),

        getAllStakeholderRegister: builder.query<
            TPaginatedResponse<TStakeholderRegisterData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `/programs/stakeholders/`,
                params,
            }),
            providesTags: ["STAKEHOLDER_REGISTER"],
        }),

        getSingleStakeholderRegister: builder.query<
            TResponse<TStakeholderRegisterData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/programs/stakeholders/${id}/`,
            }),
        }),

        editStakeholderRegister: builder.mutation<
            TResponse<TStakeholderRegisterData>,
            { id: string; body: TStakeholderRegisterFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/programs/stakeholders/${id}/`,
                body,
            }),
            invalidatesTags: ["STAKEHOLDER_REGISTER"],
        }),

        deleteStakeholderRegister: builder.mutation<
            TResponse<TStakeholderRegisterData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `/programs/stakeholders/${id}/`,
            }),
            invalidatesTags: ["STAKEHOLDER_REGISTER"],
        }),
    }),
});

export const {
    useCreateStakeholderRegisterMutation,
    useGetAllStakeholderRegisterQuery,
    useGetSingleStakeholderRegisterQuery,
    useEditStakeholderRegisterMutation,
    useDeleteStakeholderRegisterMutation,
} = stakeholderAPI;
