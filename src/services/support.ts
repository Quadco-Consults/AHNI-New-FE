 
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from ".";
import { TSupportFormValues, TSupportPaginatedData, TSupportSingleData } from "definations/support/support";

const BASE_URL = `/support/ticket/`;

const SUPPORTAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createTicket: builder.mutation<
            TResponse<TSupportSingleData>,
            TSupportFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["SUPPORT_MANAGEMENT"],
        }),

        getAllTickets: builder.query<
            TPaginatedResponse<TSupportPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["SUPPORT_MANAGEMENT"],
        }),

        getSingleTicket: builder.query<TResponse<TSupportSingleData>, string>({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
        }),

        editTicket: builder.mutation<
            TResponse<TSupportSingleData>,
            { id: string; body:  object }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["SUPPORT_MANAGEMENT"],
        }),

        
    }),
});

export const {
    useCreateTicketMutation,
    useGetAllTicketsQuery,
    useGetSingleTicketQuery,
    useEditTicketMutation, 
} = SUPPORTAPI;
