import { TBasePaginatedResponse } from "definations/auth";
import baseAPI from "..";
import { TSSPResponse, TSSSPFormValues } from "definations/program-types/ssp";

const SSPAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createSSP: builder.mutation<
            TBasePaginatedResponse<TSSPResponse>,
            TSSSPFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: "/programs/plans/supportive-supervision/",
                body,
            }),
        }),
    }),
});

export const { useCreateSSPMutation } = SSPAPI;
