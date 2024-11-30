import baseAPI from "..";
import {
    TStakeholderRegister,
    TStakeholderRegisterResponse,
} from "definations/program-validator";
import { TBasePaginatedResponse, TRequest, TResponse } from "definations/auth";

const stakeholderAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createStakeholderRegister: builder.mutation<
            TResponse<TStakeholderRegister>,
            TStakeholderRegister
        >({
            query: (body) => ({
                method: "POST",
                url: "/programs/stakeholders/",
                body,
            }),
            invalidatesTags: ["STAKEHOLDER_REGISTER"],
        }),

        getAllStakeholderRegister: builder.query<
            TBasePaginatedResponse<TStakeholderRegisterResponse>,
            TRequest
        >({
            query: () => ({
                method: "GET",
                url: `/programs/stakeholders/`,
            }),
            providesTags: ["STAKEHOLDER_REGISTER"],
        }),

        getSingleStakeholderRegister: builder.query<
            TResponse<TStakeholderRegister>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/programs/stakeholders/${id}/`,
            }),
        }),

        editStakeholderRegister: builder.mutation<
            TResponse<TStakeholderRegisterResponse>,
            { id: string; body: TStakeholderRegister }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/programs/stakeholders/${id}/`,
                body,
            }),
            invalidatesTags: ["STAKEHOLDER_REGISTER"],
        }),

        deleteStakeholderRegister: builder.mutation<
            TResponse<TStakeholderRegisterResponse>,
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
